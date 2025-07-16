import { Response, Request, Router } from "express";
import { User } from "../models/user";
import { Column } from "../models/columns";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { logger } from "../logger";

const router = Router();

router.post("/user/signup", async (req: Request, res: Response) => {
  try {
    const userDetails = req.body;

    const hashedPassword = await bcrypt.hash(userDetails.password, 10);

    const user = await User.create({
      name: userDetails.name,
      email: userDetails.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

    res.status(201).json({
      token,
      userId: user._id,
    });
  } catch (error: any) {
    logger.error(error.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
});

router.post("/user/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      res.status(404).json("User not found");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (!isPasswordValid) {
      res.status(403).json({
        msg: "wrong Credentials",
      });
      return;
    }

    const token = jwt.sign(
      { id: userExist._id },
      process.env.JWT_SECRET as string
    );
    res.json({
      token,
      userId: userExist._id,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
});

export { router as authRouter };