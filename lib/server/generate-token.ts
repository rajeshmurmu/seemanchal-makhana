import jwt from "jsonwebtoken";
export const generateAccessToken = ({
  id,
  email,
  name,
}: {
  email: string;
  id: string;
  name: string;
}) => {
  return jwt.sign({ id, email, name }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};
