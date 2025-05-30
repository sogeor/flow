
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
import { Card as CardType } from "@/types";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type EditCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardType | null;
  onCardUpdated: (card: CardType) => void;
  onCardDeleted: (cardId: string) => void;
};

export function EditCardDialog({
  open,
  onOpenChange,
  card,
  onCardUpdated,
  onCardDeleted,
}: EditCardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || "");
      setDate(card.dueDate ? new Date(card.dueDate) : undefined);
    }
  }, [card]);

  const handleUpdateCard = () => {
    if (!card) return;

    if (!title) {
      toast({
        title: "Ошибка",
        description: "Введите название карточки",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedCard: CardType = {
        ...card,
        title,
        description,
        dueDate: date ? date.toISOString() : undefined,
      };

      // Update card in localStorage
      const existingCardsStr = localStorage.getItem("cards");
      const existingCards = existingCardsStr ? JSON.parse(existingCardsStr) : [];

      const updatedCards = existingCards.map((c: CardType) =>
        c.id === card.id ? updatedCard : c
      );

      localStorage.setItem("cards", JSON.stringify(updatedCards));

      // Call callback function
      onCardUpdated(updatedCard);
      onOpenChange(false);
      setIsLoading(false);

      toast({
        title: "Успешно",
        description: `Карточка "${title}" обновлена`,
      });
    }, 500);
  };

  const handleDeleteCard = () => {
    if (!card) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Delete card from localStorage
      const existingCardsStr = localStorage.getItem("cards");
      const existingCards = existingCardsStr ? JSON.parse(existingCardsStr) : [];

      const updatedCards = existingCards.filter((c: CardType) => c.id !== card.id);

      localStorage.setItem("cards", JSON.stringify(updatedCards));

      // Call callback function
      onCardDeleted(card.id);
      onOpenChange(false);
      setIsLoading(false);

      toast({
        title: "Успешно",
        description: `Карточка "${card.title}" удалена`,
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать карточку</DialogTitle>
          <DialogDescription>
            Измените информацию о карточке или удалите её.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-card-title">Название</Label>
            <Input
              id="edit-card-title"
              placeholder="Введите название карточки"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-card-description">Описание</Label>
            <Textarea
              id="edit-card-description"
              placeholder="Описание карточки (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Срок выполнения</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: ru })
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteCard}
            disabled={isLoading}
            className="mt-2 sm:mt-0"
          >
            Удалить карточку
          </Button>
          <div className="flex flex-col-reverse sm:flex-row sm:space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-2 sm:mt-0">
              Отмена
            </Button>
            <Button onClick={handleUpdateCard} disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
