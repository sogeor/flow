
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
import { Card as CardType } from "@/types";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type CreateCardDialogProps = {
  columnId: string;
  onCardCreated: (card: CardType) => void;
};

export function CreateCardDialog({ columnId, onCardCreated }: CreateCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCard = () => {
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
      // Get existing cards or initialize empty array
      const existingCardsStr = localStorage.getItem("cards");
      const existingCards = existingCardsStr ? JSON.parse(existingCardsStr) : [];
      
      // Find the highest order value for this column
      const columnCards = existingCards.filter((card: CardType) => card.columnId === columnId);
      const maxOrder = columnCards.length > 0 
        ? Math.max(...columnCards.map((card: CardType) => card.order))
        : -1;
      
      // Create new card with next order value
      const newCard: CardType = {
        id: `card_${Date.now()}`,
        title,
        description,
        columnId,
        order: maxOrder + 1,
        dueDate: date ? date.toISOString() : undefined,
      };
      
      // Save to localStorage
      const updatedCards = [...existingCards, newCard];
      localStorage.setItem("cards", JSON.stringify(updatedCards));
      
      // Call callback function
      onCardCreated(newCard);
      
      setTitle("");
      setDescription("");
      setDate(undefined);
      setOpen(false);
      setIsLoading(false);
      
      toast({
        title: "Успешно",
        description: `Карточка "${title}" создана`,
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          Добавить карточку
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новая карточка</DialogTitle>
          <DialogDescription>
            Создайте новую карточку для этой колонки.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="card-title">Название</Label>
            <Input
              id="card-title"
              placeholder="Введите название карточки"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="card-description">Описание</Label>
            <Textarea
              id="card-description"
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleCreateCard} disabled={isLoading}>
            {isLoading ? "Создание..." : "Создать карточку"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
