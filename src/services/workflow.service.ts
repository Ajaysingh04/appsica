import connectDB from "@/lib/mongodb";
import Workflow from "@/models/Workflow";
import { defaultWorkflowSteps, defaultSuccessProjects } from "@/lib/defaultData";
import { IWorkflowStep, ISuccessProject } from "@/types";

export class WorkflowService {
  static async getWorkflowData(): Promise<{
    steps: IWorkflowStep[];
    successProjects: ISuccessProject[];
  }> {
    try {
      await connectDB();
      const steps = await Workflow.find().sort({ order: 1, createdAt: 1 }).lean();
      return {
        steps:
          steps && steps.length > 0
            ? (steps as unknown as IWorkflowStep[])
            : (defaultWorkflowSteps as unknown as IWorkflowStep[]),
        successProjects: defaultSuccessProjects,
      };
    } catch {
      return {
        steps: defaultWorkflowSteps as unknown as IWorkflowStep[],
        successProjects: defaultSuccessProjects,
      };
    }
  }
}
