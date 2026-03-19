export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body, fallback to {} if undefined so optional schemas don't fail
      const validated = await schema.parseAsync(req.body || {});
      // Attach validated data to req (optional if using strict schemas)
      req.validatedData = validated;
      next();
    } catch (error) {
      console.error("[Zod Validation Error]:", JSON.stringify(error.errors));
      
      const errorMessages = error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
      
      // Send 400 Bad Request if validation fails
      return res.status(400).json({
        success: false,
        message: errorMessages || "Validation failed",
        errors: error.errors,
      });
    }
  };
};
