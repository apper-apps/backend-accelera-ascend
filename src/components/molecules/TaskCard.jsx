import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskCard = ({ task, onEdit, onDelete, onStatusUpdate }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const getTaskTypeColor = (type) => {
    switch (type) {
      case "React": return "react";
      case "Maintain": return "maintain";
      case "Improve": return "improve";
      default: return "default";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "To Do": return "todo";
      case "In Progress": return "progress";
      case "Done": return "done";
      default: return "default";
    }
  };

  const getDueDateColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 3) return "text-orange-600";
    return "text-slate-600";
};

  const handleStatusClick = async () => {
    if (isUpdatingStatus || !onStatusUpdate) return;
    
    setIsUpdatingStatus(true);
    try {
      // Cycle through status: To Do → In Progress → Done → To Do
      let nextStatus;
      switch (task.status) {
        case "To Do":
          nextStatus = "In Progress";
          break;
        case "In Progress":
          nextStatus = "Done";
          break;
        case "Done":
          nextStatus = "To Do";
          break;
        default:
          nextStatus = "To Do";
      }
      
      await onStatusUpdate(task.Id, { status: nextStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleQuickComplete = async (e) => {
    e.stopPropagation();
    if (isUpdatingStatus || !onStatusUpdate) return;
    
    setIsUpdatingStatus(true);
    try {
      const newStatus = task.status === "Done" ? "To Do" : "Done";
      await onStatusUpdate(task.Id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isCompleted = task.status === "Done";

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
      isCompleted ? 'opacity-75' : ''
    } ${isUpdatingStatus ? 'pointer-events-none' : ''}`}>
      <CardHeader className="pb-3">
<div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Quick completion checkbox */}
            <button
              onClick={handleQuickComplete}
              disabled={isUpdatingStatus}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-slate-300 hover:border-green-400'
              } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'}`}
            >
              {isCompleted && <ApperIcon name="Check" className="h-3 w-3" />}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-semibold mb-2 transition-all ${
                isCompleted 
                  ? 'text-slate-500 line-through' 
                  : 'text-slate-800'
              }`}>
                {task.title}
              </h3>
            <div className="flex items-center gap-2">
<div className="flex items-center gap-2">
                <Badge variant={getTaskTypeColor(task.taskType)}>
                  {task.taskType}
                </Badge>
                <Badge 
                  variant={getStatusVariant(task.status)}
                  onClick={handleStatusClick}
                  className={`transition-all ${
                    isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                  }`}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Loader2" className="h-3 w-3 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    task.status
                  )}
                </Badge>
              </div>
            </div>
          </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
            >
              <ApperIcon name="Edit2" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task)}
              className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
<p className={`text-sm mb-4 line-clamp-2 transition-all ${
          isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'
        }`}>
          {task.description}
        </p>
        
        <div className="space-y-2">
          <div className={`flex items-center text-sm transition-all ${
            isCompleted ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <ApperIcon name="User" className="h-4 w-4 mr-2" />
            <span>{task.assignee}</span>
          </div>
          
          <div className={`flex items-center text-sm ${
            isCompleted ? 'text-slate-400' : getDueDateColor(task.dueDate)
          }`}>
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            <span>Due {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;