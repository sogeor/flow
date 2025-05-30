
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Board } from "@/types";

type CreateBoardDialogProps = {
  onBoardCreated: (board: Board) => void;
};

export function CreateBoardDialog({ onBoardCreated }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBoard = () => {
    if (!title) {
      toast({
        title: "Ошибка",
        description: "Введите название доски",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : { id: "user1" };
      
      const newBoard: Board = {
        id: `board_${Date.now()}`,
        title,
        description,
        ownerId: user.id,
      };

      // Get existing boards or initialize empty array
      const existingBoardsStr = localStorage.getItem("boards");
      const existingBoards = existingBoardsStr ? JSON.parse(existingBoardsStr) : [];
      
      // Add new board and save to localStorage
      const updatedBoards = [...existingBoards, newBoard];
      localStorage.setItem("boards", JSON.stringify(updatedBoards));

      // Initialize empty columns for the new board
      const existingColumnsStr = localStorage.getItem("columns");
      const existingColumns = existingColumnsStr ? JSON.parse(existingColumnsStr) : [];
      
      // Add default columns
      const defaultColumns = [
        { id: `col_${Date.now()}_1`, title: "Нужно сделать", boardId: newBoard.id, order: 0 },
        { id: `col_${Date.now()}_2`, title: "В процессе", boardId: newBoard.id, order: 1 },
        { id: `col_${Date.now()}_3`, title: "Готово", boardId: newBoard.id, order: 2 },
      ];
      
      localStorage.setItem("columns", JSON.stringify([...existingColumns, ...defaultColumns]));
      
      // Call callback function
      onBoardCreated(newBoard);
      
      setTitle("");
      setDescription("");
      setOpen(false);
      setIsLoading(false);
      
      toast({
        title: "Успешно",
        description: `Доска "${title}" создана`,
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Создать доску</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новая доска</DialogTitle>
          <DialogDescription>
            Создайте новую Kanban-доску для вашего проекта.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              placeholder="Введите название доски"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Описание доски (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleCreateBoard} disabled={isLoading}>
            {isLoading ? "Создание..." : "Создать доску"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
