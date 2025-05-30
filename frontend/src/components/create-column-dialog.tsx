
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
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Column } from "@/types";

type CreateColumnDialogProps = {
  boardId: string;
  onColumnCreated: (column: Column) => void;
};

export function CreateColumnDialog({ boardId, onColumnCreated }: CreateColumnDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateColumn = () => {
    if (!title) {
      toast({
        title: "Ошибка",
        description: "Введите название колонки",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Get existing columns or initialize empty array
      const existingColumnsStr = localStorage.getItem("columns");
      const existingColumns = existingColumnsStr ? JSON.parse(existingColumnsStr) : [];
      
      // Find the highest order value for this board
      const boardColumns = existingColumns.filter((col: Column) => col.boardId === boardId);
      const maxOrder = boardColumns.length > 0 
        ? Math.max(...boardColumns.map((col: Column) => col.order))
        : -1;
      
      // Create new column with next order value
      const newColumn: Column = {
        id: `col_${Date.now()}`,
        title,
        boardId,
        order: maxOrder + 1,
      };
      
      // Save to localStorage
      const updatedColumns = [...existingColumns, newColumn];
      localStorage.setItem("columns", JSON.stringify(updatedColumns));
      
      // Call callback function
      onColumnCreated(newColumn);
      
      setTitle("");
      setOpen(false);
      setIsLoading(false);
      
      toast({
        title: "Успешно",
        description: `Колонка "${title}" создана`,
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить колонку</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новая колонка</DialogTitle>
          <DialogDescription>
            Создайте новую колонку для вашей Kanban-доски.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="column-title">Название</Label>
            <Input
              id="column-title"
              placeholder="Введите название колонки"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleCreateColumn} disabled={isLoading}>
            {isLoading ? "Создание..." : "Создать колонку"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
