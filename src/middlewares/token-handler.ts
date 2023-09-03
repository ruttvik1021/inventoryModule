import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../constants/constants";

// const returnSwitchCase = (decodedToken: any, location: string) => {
//   switch (location) {
//     case middlewareLocations.CurrentUser:
//       return { email: decodedToken.email };
//     default:
//       return { decodedToken };
//   }
// };

export const TokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    // Split the header into two parts: Bearer and the token
    const [bearer, token] = authHeader.split(" ");

    if (bearer === "Bearer" && token) {
      // Token is available here
      try {
        const validToken: any = jwt.verify(token, JWT_KEY);
        if (validToken) {
          req.body.details = validToken;
          req.body.token = token;
          // req.body.details = returnSwitchCase(validToken, middlewareLocation);
          next();
        }
      } catch (error: any) {
        res.status(401).send({ message: "Unauthorized" });
      }
      // You can use the token for further processing or authentication
    } else {
      // Invalid Authorization header format
      res.status(401).send({ message: "Unauthorized" });
    }
  } else {
    // Authorization header not found
    res.status(401).send({ message: "Unauthorized" });
  }
};
