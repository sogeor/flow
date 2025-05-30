import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Board as BoardType, Column, Card } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CreateColumnDialog } from "@/components/create-column-dialog";
import { KanbanColumn } from "@/components/kanban-column";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { boardsAPI, workflowAPI } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Board = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load notification preference from localStorage (this is user preference, not synced with backend)
  useEffect(() => {
    const notificationPref = localStorage.getItem(`notifications_${boardId}`);
    setNotificationsEnabled(notificationPref === "true");
  }, [boardId]);

  // Fetch board details
  const {
    data: board,
    isLoading: isBoardLoading,
    error: boardError
  } = useQuery({
    queryKey: ['board'],
    queryFn: () => {
      // This is a workaround since we don't have a direct API to get board details
      // We'll get all boards for the user and find the one we need
      return boardsAPI.getUserBoards('me').then(boards => {
        const foundBoard = boards.find(b => b.id === boardId);
        if (!foundBoard) throw new Error("Доска не найдена");
        return foundBoard;
      });
    },
    enabled: !!boardId && isAuthenticated,
  });

  // Fetch workflow (columns and cards)
  const {
    data: columns = [],
    isLoading: isWorkflowLoading,
    error: workflowError
  } = useQuery({
    queryKey: ['workflow'],
    queryFn: () => workflowAPI.getBoardWorkflow(boardId!),
    enabled: !!boardId && isAuthenticated,
  });

  // Extract cards from columns for easier manipulation
  const cards = columns.flatMap(col => col.cards || []);

  // Create column mutation
  const createColumnMutation = useMutation({
    mutationFn: (title: string) => workflowAPI.createColumn(boardId!, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать колонку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    },
  });

  // Delete column mutation
  const deleteColumnMutation = useMutation({
    mutationFn: (columnId: string) => workflowAPI.deleteColumn(boardId!, columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow'] });
      toast({
        title: "Успешно",
        description: "Колонка удалена",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить колонку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    },
  });

  // Create card mutation
  const createCardMutation = useMutation({
    mutationFn: ({ columnId, title, description }: { columnId: string; title: string; description?: string }) =>
        workflowAPI.createCard(boardId!, columnId, { title, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать карточку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    },
  });

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: ({ columnId, cardId }: { columnId: string; cardId: string }) =>
        workflowAPI.deleteCard(boardId!, columnId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow'] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить карточку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    },
  });

  // Handle column creation
  const handleColumnCreated = (newColumn: Column) => {
    createColumnMutation.mutate(newColumn.title);
  };

  // Handle card creation
  const handleCardCreated = (newCard: Card) => {
    createCardMutation.mutate({
      columnId: newCard.columnId,
      title: newCard.title,
      description: newCard.description
    });
  };

  // Handle card update
  const handleCardUpdated = (updatedCard: Card) => {
    // Since we don't have an API to update cards, we'll need to delete and recreate
    // This is a workaround and not ideal for production
    deleteCardMutation.mutate({
      columnId: updatedCard.columnId,
      cardId: updatedCard.id
    }, {
      onSuccess: () => {
        createCardMutation.mutate({
          columnId: updatedCard.columnId,
          title: updatedCard.title,
          description: updatedCard.description
        });
      }
    });
  };

  // Handle card deletion
  const handleCardDeleted = (cardId: string, columnId: string) => {
    deleteCardMutation.mutate({ columnId, cardId });
  };

  // Handle column deletion
  const handleColumnDeleted = (columnId: string) => {
    const columnCards = cards.filter(card => card.columnId === columnId);
    if (columnCards.length > 0) {
      toast({
        title: "Невозможно удалить колонку",
        description: "Сначала удалите все карточки из колонки",
        variant: "destructive",
      });
      return;
    }
    deleteColumnMutation.mutate(columnId);
  };

  const handleColumnTitleChanged = (columnId: string, newTitle: string) => {
    // Since we don't have an API to update column titles, we'll use a workaround
    // Delete the column and recreate it with the new title
    // This is not ideal for production as it would lose all cards
    // Therefore, in this demo, we'll just show a toast for now
    toast({
      title: "Изменение названия колонки",
      description: "Функция изменения названия колонки в настоящее время не поддерживается API",
    });
  };

  const handleToggleNotifications = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem(`notifications_${boardId}`, checked.toString());

    toast({
      title: checked ? "Уведомления включены" : "Уведомления отключены",
      description: checked
          ? "Вы будете получать уведомления о сроках задач"
          : "Уведомления о сроках задач отключены",
    });
  };

  const handleDragStart = (cardId: string, columnId: string) => {
    setDraggingCardId(cardId);
    setSourceColumnId(columnId);
  };

  const handleDragOver = (columnId: string) => {
    if (columnId !== targetColumnId) {
      setTargetColumnId(columnId);
    }
  };

  const handleDrop = () => {
    if (draggingCardId && sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
      // Get the card that's being dragged
      const draggedCard = cards.find(card => card.id === draggingCardId);

      if (!draggedCard) return;

      // Delete the card from source column and create it in target column
      deleteCardMutation.mutate(
          { columnId: sourceColumnId, cardId: draggingCardId },
          {
            onSuccess: () => {
              createCardMutation.mutate({
                columnId: targetColumnId!,
                title: draggedCard.title,
                description: draggedCard.description
              });

              // Reset dragging state
              setDraggingCardId(null);
              setSourceColumnId(null);
              setTargetColumnId(null);
            }
          }
      );
    }
  };

  // Handle errors
  useEffect(() => {
    if (boardError) {
      console.error("Error fetching board:", boardError);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить доску. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    }

    if (workflowError) {
      console.error("Error fetching workflow:", workflowError);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить колонки и задачи. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    }
  }, [boardError, workflowError]);

  const isLoading = isBoardLoading || isWorkflowLoading;

  if (isLoading || !board) {
    return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-muted-foreground">Загрузка...</div>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{board.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={handleToggleNotifications}
                />
                <Label htmlFor="notifications" className="text-sm cursor-pointer">
                  Уведомления о дедлайнах
                </Label>
              </div>
              <Button variant="outline" onClick={() => navigate("/boards")}>
                Назад к доскам
              </Button>
            </div>
          </div>

          {board.description && (
              <p className="text-muted-foreground mb-6">{board.description}</p>
          )}

          <div className="mb-6">
            <CreateColumnDialog boardId={board.id} onColumnCreated={handleColumnCreated} />
          </div>

          {columns.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">У этой доски пока нет колонок</h2>
                <p className="text-muted-foreground mb-6">
                  Создайте вашу первую колонку, чтобы начать работу
                </p>
              </div>
          ) : (
              <div className="flex gap-6 overflow-x-auto pb-6">
                {columns
                    .sort((a, b) => a.order - b.order)
                    .map((column) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            cards={column.cards || []}
                            onCardCreated={handleCardCreated}
                            onCardUpdated={handleCardUpdated}
                            onCardDeleted={(cardId) => handleCardDeleted(cardId, column.id)}
                            onColumnDeleted={handleColumnDeleted}
                            onColumnTitleChanged={handleColumnTitleChanged}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            isDragging={Boolean(draggingCardId)}
                        />
                    ))}
              </div>
          )}
        </main>

        <Footer />
      </div>
  );
};

export default Board;