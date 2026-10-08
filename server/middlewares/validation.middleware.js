export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body, fallback to {} if undefined so optional schemas don't fail
      const validated = await schema.parseAsync(req.body || {});
      // Attach validated data to req (optional if using strict schemas)
      req.validatedData = validated;
      next();
    } catch (error) {
      // Not a Zod error — let the error middleware handle it
      if (error?.name !== "ZodError") return next(error);

      // Zod v4 exposes `issues` (v3 also had the `errors` alias)
      const issues = error.issues ?? error.errors ?? [];
      const errorMessages = issues
        .map((issue) => (issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message))
        .join(", ");

      // Send 400 Bad Request if validation fails
      return res.status(400).json({
        success: false,
        message: errorMessages || "Validation failed",
        errors: issues,
      });
    }
  };
};
