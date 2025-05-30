
import { useState } from "react";
import { Card, Column as ColumnType } from "@/types";
import { Input } from "@/components/ui/input";
import { Card as UICard, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CreateCardDialog } from "@/components/create-card-dialog";
import { EditCardDialog } from "@/components/edit-card-dialog";
import { format, isAfter, startOfToday } from "date-fns";
import { ru } from "date-fns/locale";
import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

type KanbanColumnProps = {
  column: ColumnType;
  cards: Card[];
  onCardCreated: (card: Card) => void;
  onCardUpdated: (card: Card) => void;
  onCardDeleted: (cardId: string) => void;
  onColumnDeleted: (columnId: string) => void;
  onColumnTitleChanged: (columnId: string, title: string) => void;
  onDragStart: (cardId: string, columnId: string) => void;
  onDragOver: (columnId: string) => void;
  onDrop: () => void;
  isDragging: boolean;
};

export function KanbanColumn({
  column,
  cards,
  onCardCreated,
  onCardUpdated,
  onCardDeleted,
  onColumnDeleted,
  onColumnTitleChanged,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: KanbanColumnProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [editCardDialogOpen, setEditCardDialogOpen] = useState(false);

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (title !== column.title) {
      onColumnTitleChanged(column.id, title);
    }
  };

  const handleColumnDelete = () => {
    if (cards.length > 0) {
      toast({
        title: "Невозможно удалить колонку",
        description: "Сначала удалите все карточки из колонки",
        variant: "destructive",
      });
      return;
    }
    onColumnDeleted(column.id);
  };

  const handleCardClick = (card: Card) => {
    setCurrentCard(card);
    setEditCardDialogOpen(true);
  };

  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    return isAfter(startOfToday(), new Date(dueDate));
  };

  return (
    <div
      className="kanban-column"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <div className="flex items-center justify-between pb-2">
        {editingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
            autoFocus
            className="font-bold"
          />
        ) : (
          <h3
            className="font-bold text-lg cursor-pointer truncate"
            onClick={() => setEditingTitle(true)}
          >
            {column.title}
          </h3>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleColumnDelete}
          className="h-7 w-7"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 flex-grow">
        {cards
          .sort((a, b) => a.order - b.order)
          .map((card) => (
            <UICard
              key={card.id}
              className={`kanban-card ${isDragging ? "hover:cursor-grab" : ""}`}
              draggable={true}
              onDragStart={() => onDragStart(card.id, column.id)}
              onClick={() => handleCardClick(card)}
            >
              <CardHeader className="p-3 pb-0">
                <h4 className="font-medium">{card.title}</h4>
              </CardHeader>
              {card.description && (
                <CardContent className="p-3 pt-1 pb-0 text-sm text-muted-foreground">
                  {card.description.length > 100
                    ? `${card.description.substring(0, 100)}...`
                    : card.description}
                </CardContent>
              )}
              {card.dueDate && (
                <CardFooter className="p-3 pt-1 text-xs">
                  <span className={`${isOverdue(card.dueDate) ? "text-destructive" : "text-muted-foreground"}`}>
                    {format(new Date(card.dueDate), "d MMMM", { locale: ru })}
                  </span>
                </CardFooter>
              )}
            </UICard>
          ))}
      </div>

      <CreateCardDialog columnId={column.id} onCardCreated={onCardCreated} />

      <EditCardDialog
        open={editCardDialogOpen}
        onOpenChange={setEditCardDialogOpen}
        card={currentCard}
        onCardUpdated={onCardUpdated}
        onCardDeleted={onCardDeleted}
      />
    </div>
  );
}
