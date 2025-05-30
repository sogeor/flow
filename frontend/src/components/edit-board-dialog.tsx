
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Board } from "@/types";

type EditBoardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  board: Board | null;
  onBoardUpdated: (board: Board) => void;
};

export function EditBoardDialog({ 
  open, 
  onOpenChange, 
  board, 
  onBoardUpdated 
}: EditBoardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description);
    }
  }, [board]);

  const handleUpdateBoard = () => {
    if (!board) return;
    
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
      const updatedBoard: Board = {
        ...board,
        title,
        description,
      };

      // Update board in localStorage
      const existingBoardsStr = localStorage.getItem("boards");
      const existingBoards = existingBoardsStr ? JSON.parse(existingBoardsStr) : [];
      
      const updatedBoards = existingBoards.map((b: Board) => 
        b.id === board.id ? updatedBoard : b
      );
      
      localStorage.setItem("boards", JSON.stringify(updatedBoards));
      
      // Call callback function
      onBoardUpdated(updatedBoard);
      onOpenChange(false);
      setIsLoading(false);
      
      toast({
        title: "Успешно",
        description: `Доска "${title}" обновлена`,
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать доску</DialogTitle>
          <DialogDescription>
            Измените информацию о доске.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Название</Label>
            <Input
              id="edit-title"
              placeholder="Введите название доски"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Описание</Label>
            <Textarea
              id="edit-description"
              placeholder="Описание доски (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleUpdateBoard} disabled={isLoading}>
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
