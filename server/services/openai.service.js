/**
 * AI Service (Gemini) — Legaforce
 *
 * Provides Gemini-powered:
 *   1. CV summary generation from profile data
 *   2. AI match scoring (candidate vs job requirements)
 *
 * Falls back to local logic when no AI key is set.
 */
import { GEMINI_API_KEY, OPENAI_API_KEY } from "../config/env.js";

const AI_API_KEY = GEMINI_API_KEY || OPENAI_API_KEY || "";
const isEnabled = !!AI_API_KEY;

if (isEnabled) {
  console.log(" Gemini API initialized");
} else {
  console.log("⚠️  Gemini API key not configured — using local fallback");
}

// ── Shared fetch helper (with retry for rate limits) ──

async function chatCompletion(systemPrompt, userPrompt, maxTokens = 1024) {
  if (!isEnabled) return null;

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: maxTokens,
            },
          }),
        },
      );

      if (response.status === 429 && attempt < MAX_RETRIES) {
        // Parse retry delay from error or use exponential backoff
        const errBody = await response.json().catch(() => ({}));
        const retryMatch =
          errBody?.error?.message?.match(/retry in ([\d.]+)s/i);
        const waitSec = retryMatch
          ? Math.min(parseFloat(retryMatch[1]), 60)
          : (attempt + 1) * 15;
        console.warn(
          `Gemini rate limited — retrying in ${Math.ceil(waitSec)}s (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((r) => setTimeout(r, waitSec * 1000));
        continue;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Gemini API error:", response.status, error);
        return null;
      }

      const data = await response.json();
      const textParts = data.candidates?.[0]?.content?.parts || [];
      const text = textParts
        .map((part) => part?.text || "")
        .join("")
        .trim();
      return text || null;
    } catch (err) {
      console.error("Gemini request failed:", err.message);
      return null;
    }
  }

  console.warn("Gemini: max retries exceeded, falling back to local");
  return null;
}

// ── 1. Generate CV Summary ─────────────────────

export async function generateCVSummary(profile, cvData = {}) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const experience = cvData.experience || [];
  const skills = cvData.skills || [];
  const education = cvData.education || [];
  const certifications = cvData.certifications || [];

  const systemPrompt = `You are an expert professional CV writer specializing in overseas Filipino workers (OFW) and international manpower recruitment. Write clear, professional, and compelling CV content. Always write in third person. Be specific and quantify achievements when possible.`;

  const userPrompt = `Generate a professional CV summary (2-3 paragraphs) and a list of key strengths for this candidate:

Name: ${fullName}
Nationality: ${profile.nationality || "Filipino"}
Phone: ${profile.phone || "Not provided"}

Work Experience:
${experience.length > 0 ? experience.map((e) => `- ${e.position || e.title} at ${e.employer || e.company || "N/A"} (${e.startDate || "?"} – ${e.endDate || "Present"}): ${e.description || "No description"}`).join("\n") : "No work experience listed"}

Skills: ${skills.length > 0 ? skills.join(", ") : "None listed"}

Education:
${education.length > 0 ? education.map((e) => `- ${e.degree} from ${e.school || e.institution || "N/A"} (${e.year || ""})`).join("\n") : "None listed"}

Certifications:
${certifications.length > 0 ? certifications.map((c) => `- ${c.name} (${c.issuer || ""})`).join("\n") : "None listed"}

Return a JSON object with this structure (no markdown, just raw JSON):
{
  "summary": "Professional summary paragraph(s)",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4", "Strength 5"]
}`;

  const result = await chatCompletion(systemPrompt, userPrompt, 800);

  if (result) {
    try {
      // Strip markdown code fences if present
      const cleaned = result
        .replace(/```json?\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      return {
        summary: parsed.summary || "",
        keyStrengths: parsed.keyStrengths || [],
        generatedBy: "gemini-2.0-flash",
      };
    } catch (err) {
      console.error("Failed to parse Gemini CV response:", err.message);
      // Fall through to local fallback
    }
  }

  // ── Local fallback ──
  return {
    summary: buildLocalSummary(
      fullName,
      profile,
      experience,
      skills,
      education,
      certifications,
    ),
    keyStrengths: skills.slice(0, 5),
    generatedBy: "local-fallback",
  };
}

function buildLocalSummary(
  fullName,
  profile,
  experience,
  skills,
  education,
  certifications,
) {
  let s = `${fullName} is a dedicated professional`;
  const titles = experience.map((e) => e.position || e.title).filter(Boolean);
  if (titles.length > 0)
    s += ` with experience as ${titles.slice(0, 3).join(", ")}`;
  if (profile.nationality) s += ` from ${profile.nationality}`;
  const degrees = education.map((e) => e.degree).filter(Boolean);
  if (degrees.length > 0) s += `. Holds a ${degrees[0]}`;
  if (skills.length > 0) s += `. Skilled in ${skills.slice(0, 5).join(", ")}`;
  const certNames = certifications.map((c) => c.name).filter(Boolean);
  if (certNames.length > 0)
    s += `. Certified in ${certNames.slice(0, 3).join(", ")}`;
  s +=
    ". Seeking overseas employment opportunities for career growth and professional development.";
  return s;
}

// ── 2. AI Match Score ──────────────────────────

export async function computeAIMatchScore(
  profileSkills,
  jobRequirements,
  jobTitle,
) {
  const systemPrompt = `You are an expert AI recruitment matching system. Evaluate how well a candidate matches a job based on:
1. Technical skills match (required vs candidate's skills)
2. Experience level
3. Education relevance
4. Cultural fit potential

Return a JSON object with:
- "score" (0-100 integer, where 80+ is excellent match)
- "confidence" (0-100, how certain you are about the score)
- "reason" (1-2 sentences)
- "strengths" (array of 2-3 matching areas)
- "gaps" (array of 2-3 missing areas)`;

  const skillsList = Array.isArray(profileSkills) ? profileSkills : [];
  const reqList = Array.isArray(jobRequirements)
    ? jobRequirements
    : Array.isArray(jobRequirements?.skills)
      ? jobRequirements.skills
      : [];

  const userPrompt = `Job title: ${jobTitle || "Unknown"}
Job requirements/skills: ${reqList.length > 0 ? reqList.join(", ") : "None specified"}
Candidate skills: ${skillsList.length > 0 ? skillsList.join(", ") : "None listed"}

Return a JSON object (no markdown): { "score": <0-100>, "confidence": <0-100>, "reason": "brief explanation", "strengths": ["strength1", "strength2"], "gaps": ["gap1", "gap2"] }`;

  const result = await chatCompletion(systemPrompt, userPrompt, 300);

  if (result) {
    try {
      const cleaned = result
        .replace(/```json?\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      return {
        score: Math.max(0, Math.min(100, parseInt(parsed.score, 10) || 0)),
        confidence: Math.max(
          0,
          Math.min(100, parseInt(parsed.confidence, 10) || 75),
        ),
        reason: parsed.reason || "",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
        scoredBy: "gemini-2.0-flash",
      };
    } catch (err) {
      console.error("Failed to parse Gemini match response:", err.message);
    }
  }

  // ── Enhanced Local fallback: weighted skill matching ──
  if (skillsList.length === 0 || reqList.length === 0) {
    return {
      score: null,
      confidence: 0,
      reason: "Insufficient data to compute match score",
      strengths: [],
      gaps: reqList.length > 0 ? reqList : [],
      scoredBy: "local-fallback",
    };
  }

  const lowerSkills = skillsList.map((s) => s.toLowerCase());
  const lowerReqs = reqList.map((r) => r.toLowerCase());

  // Exact matches (highest weight)
  const exactMatches = lowerReqs.filter((r) => lowerSkills.includes(r));

  // Partial matches (medium weight)
  const partialMatches = lowerReqs.filter(
    (r) =>
      !exactMatches.includes(r) &&
      lowerSkills.some((s) => r.includes(s) || s.includes(r)),
  );

  // Missing skills
  const missing = lowerReqs.filter(
    (r) => !exactMatches.includes(r) && !partialMatches.includes(r),
  );

  // Weighted score: exact=100, partial=60, missing=0
  const totalScore =
    (exactMatches.length * 100 + partialMatches.length * 60) /
    (lowerReqs.length * 100);
  const score = Math.min(100, Math.round(totalScore * 100));
  const confidence = Math.round(
    75 + (exactMatches.length / lowerReqs.length) * 20,
  );

  return {
    score,
    confidence,
    reason: `${exactMatches.length} exact + ${partialMatches.length} partial skills match, ${missing.length} gaps`,
    strengths: exactMatches.slice(0, 3),
    gaps: missing.slice(0, 3),
    scoredBy: "local-fallback",
  };
}

/**
 * Enhanced talent matching with profile data (experience, education, etc.)
 */
export async function computeEnhancedMatchScore(candidateProfile, jobOrder) {
  const cv =
    candidateProfile.aiGeneratedCV &&
    typeof candidateProfile.aiGeneratedCV === "object"
      ? candidateProfile.aiGeneratedCV
      : {};

  const skills = cv.skills || cv.skillTags || [];
  const experience =
    cv.yearsOfExperience || candidateProfile.yearsExperience || 0;
  const education =
    cv.highestEducation || candidateProfile.highestEducation || "Not specified";

  const jobReqs = jobOrder.requirements || {};
  const reqSkills = Array.isArray(jobReqs.skills) ? jobReqs.skills : [];
  const minExp = jobReqs.minYearsExperience || 0;
  const preferredExp = jobReqs.preferredYearsExperience || 0;

  // Get base skill match
  const skillMatch = await computeAIMatchScore(
    skills,
    reqSkills,
    jobOrder.title,
  );

  // Calculate experience bonus/penalty
  let expScore = 50; // Base score
  if (experience >= minExp) {
    expScore = 75 + Math.min(25, (experience - minExp) * 2.5);
  } else if (experience >= minExp * 0.8) {
    expScore = 60; // Close but not quite
  }

  // Education level scoring (simple heuristic)
  const educationValue = {
    PHD: 100,
    MASTERS: 90,
    DEGREE: 80,
    DIPLOMA: 70,
    CERTIFICATE: 60,
    VOCATIONAL: 55,
    SECONDARY: 40,
    PRIMARY: 20,
  };

  let educationScore = 50;
  for (const [level, score] of Object.entries(educationValue)) {
    if (education.toUpperCase().includes(level)) {
      educationScore = score;
      break;
    }
  }

  // Weighted overall score
  const weights = { skill: 0.6, experience: 0.25, education: 0.15 };
  const baseSkillScore = skillMatch.score || 50;
  const overallScore = Math.round(
    baseSkillScore * weights.skill +
      expScore * weights.experience +
      educationScore * weights.education,
  );

  return {
    ...skillMatch,
    score: overallScore,
    experienceScore: expScore,
    educationScore: educationScore,
    yearsExperience: experience,
    education: education,
    matchBreakdown: {
      skills: { score: baseSkillScore, weight: weights.skill },
      experience: { score: expScore, weight: weights.experience },
      education: { score: educationScore, weight: weights.education },
    },
  };
}
