import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  StyledContainer,
  StyledContent,
  StyledModal,
  StyledIcon,
  StyledHeader,
  StyledFooter,
} from "./SharedStyles";
import Button from "./Button";

import closeIcon from "../assets/close.svg";
import deleteIcon from "../assets/trash.svg";
import editIcon from "../assets/edit.svg";
import calendarIcon from "../assets/calendar.svg";
import priorityIcon from "../assets/priority.svg";
import listIcon from "../assets/list.svg";
import { ITask } from "../types";
import { deleteTodo, updateTodo } from "../api/todo.api";

const H3 = styled.h3`
  font-size: 1.8rem;
  text-transform: capitalize;
  font-weight: bold;
  color: #212121;
`;

const P = styled.p`
  font-size: 1.2rem;
  color: #757575;
`;

const StyledDetail = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

interface TaskPreviewProps {
  onClose: () => void;
  width?: number;
  task: ITask;
  onDelete: () => void;
  onEdit: () => void;
  onUpdateStatus: (task: ITask, type: "SAVE" | "EDIT") => void;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({
  width,
  onClose,
  task,
  onDelete,
  onEdit,
  onUpdateStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const humanDate = moment(task.dueDate).format("DD MMMM, YYYY");
  const hasDescription = task.description !== "";
  const statusText =
    task.status === "completed" ? "Mark as in progress" : "Mark as completed";
  const toPriority = (priority: 1 | 2 | 3) => {
    const map = {
      1: "high",
      2: "medium",
      3: "low",
    };
    return map[priority];
  };

  const handleOnDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTodo(task.id);
      onDelete();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const status = task.status === "completed" ? "inprogress" : "completed";
      const todo = { ...task, status } as ITask;
      await updateTodo(task.id, todo);
      setIsLoading(false);
      onUpdateStatus(todo, "EDIT");
    } catch (err) {
      setIsLoading(false);
    }
  };
  return (
    <>
      <StyledContainer>
        <StyledModal width={width}>
          <StyledHeader>
            <StyledIcon
              isAction
              alt="delete icon"
              src={deleteIcon}
              onClick={handleOnDelete}
              color="#fafafa"
            />
            <StyledIcon
              isAction
              alt="edit icon"
              src={editIcon}
              onClick={onEdit}
              color="#fafafa"
            />
            <StyledIcon
              isAction
              alt="close icon"
              src={closeIcon}
              onClick={onClose}
              color="#fccdec"
            />
          </StyledHeader>
          <StyledContent>
            <H3>{task.name}</H3>
            <StyledDetail>
              <StyledIcon
                color="#fafafa"
                alt="calendar icon"
                src={calendarIcon}
              />
              <P>Due on {humanDate} </P>
            </StyledDetail>
            {hasDescription && (
              <StyledDetail>
                <StyledIcon color="#fafafa" alt="list icon" src={listIcon} />
                <P> {task.description} </P>
              </StyledDetail>
            )}
            <StyledDetail>
              <StyledIcon
                color="#fafafa"
                alt="priority icon"
                src={priorityIcon}
              />
              <P>This task has a {toPriority(task.priority)} priority</P>
            </StyledDetail>
          </StyledContent>
          <StyledFooter>
            <Button
              text={statusText}
              onClick={handleStatusUpdate}
              btnType="normal"
              size={150}
              color="#212121"
              isLoading={isLoading}
            />
          </StyledFooter>
        </StyledModal>
      </StyledContainer>
    </>
  );
};

export default TaskPreview;
