import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { Column } from "../models/columns";
import { Task } from "../models/task";
import { Comment } from "../models/comment";
import { logger } from "../logger";

const router = Router();

router.get(
  "/columnData",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.userId;

      const columnData = await Column.find({ authorId: userId })
        .select("_id title")
        .lean();

      const enrichedColumns = await Promise.all(
        columnData.map(async (column) => {
          const tasks = await Task.find({ columnId: column._id })
            .select("_id id title description createdAt updatedAt")
            .lean();

          const tasksWithComments = await Promise.all(
            tasks.map(async (task) => {
              const comments = await Comment.find({ taskId: task._id })
                .select("_id text authorId createdAt")
                .lean();

              return {
                ...task,
                comments,
              };
            })
          );

          return {
            id: column.id,
            title: column.title,
            tasks: tasksWithComments,
          };
        })
      );
      res.json(enrichedColumns);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

router.post("/add", authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { id, title, description, columnId } = req.body;

    const column = await Column.findOne({ id: columnId });
    const newTask = await Task.create({
      id,
      title,
      description,
      authorId: userId,
      columnId: column?._id,
    });

    res.status(201).json(newTask);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.put("/update", authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { taskId, title, description } = req.body;

    await Task.updateOne(
      { id: taskId, authorId: userId },
      { title, description }
    );

    res.status(200).json("Update successful");
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.delete(
  "/delete/:taskId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.userId;

      const task = await Task.findOne({ id: req.params.taskId });
      // Delete associated comments first
      await Comment.deleteMany({ taskId: task?._id });

      // Then delete the task
      await Task.deleteOne({ id: req.params.taskId, authorId: userId });

      res.json("deletion successful");
    } catch (error) {
      logger.error(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

router.post(
  "/addColumn",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.userId;
      const { title, columnId } = req.body;

      const column = await Column.create({
        id: columnId,
        title,
        authorId: userId,
      });

      res.json(column);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

router.delete(
  "/deleteColumn",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { columnId, userId } = req.body;

      // Delete all tasks in the column first
      const tasks = await Task.find({ columnId });
      const taskIds = tasks.map((task) => task._id);

      // Delete all comments for these tasks
      await Comment.deleteMany({ taskId: { $in: taskIds } });

      // Delete all tasks in the column
      await Task.deleteMany({ columnId });

      // Finally delete the column
      await Column.deleteOne({ _id: columnId, authorId: userId });

      res.json("Column Deleted successful");
    } catch (error) {
      logger.error(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

router.patch(
  "/changeColumn",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.userId;
      const { columnId, taskId } = req.body;

      const column = await Column.findOne({ id: columnId });

      await Task.updateOne(
        { id: taskId, authorId: userId },
        { columnId: column?._id }
      );

      res.json("Task moved");
    } catch (error) {
      logger.error(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

router.post(
  "/addComment",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { text, authorId, taskId } = req.body;

      const task = await Task.findOne({ id: taskId });

      await Comment.create({
        authorId,
        text,
        taskId: task?._id,
      });

      res.json("Comment has been successfully created");
    } catch (error) {
      logger.error(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

export { router as taskRouter };
