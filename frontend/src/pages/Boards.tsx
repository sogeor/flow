
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {useEffect, useState} from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { CreateBoardDialog } from "@/components/create-board-dialog";
import { EditBoardDialog } from "@/components/edit-board-dialog";
import { Board } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { boardsAPI } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Boards = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Fetch boards using React Query
  const {
    data: boards = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['boards'],
    queryFn: () => boardsAPI.getUserBoards(),
    enabled: isAuthenticated,
  });

  // Delete board mutation
  const deleteBoardMutation = useMutation({
    mutationFn: (boardId: string) => boardsAPI.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setSelectedBoard(null);
      setDeleteDialogOpen(false);
      
      toast({
        title: "Успешно",
        description: `Доска "${selectedBoard?.title}" удалена`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить доску: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    },
  });

  // Check authentication
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
            return null;
        }
    }, [authLoading, isAuthenticated]);

  const handleBoardCreated = async (newBoard: Board) => {
    await boardsAPI.createBoard(newBoard);
    await queryClient.invalidateQueries({ queryKey: ['boards'] });
  };

  const handleBoardUpdated = async (updatedBoard: Board) => {
    await boardsAPI.updateBoardSettings(updatedBoard.id, updatedBoard.settings)
    await queryClient.invalidateQueries({ queryKey: ['boards'] });
    setSelectedBoard(null);
  };

  const handleEditBoard = (board: Board) => {
    setSelectedBoard(board);
    setEditDialogOpen(true);
  };

  const handleDeleteBoard = (board: Board) => {
    setSelectedBoard(board);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBoard = () => {
    if (!selectedBoard) return;
    deleteBoardMutation.mutate(selectedBoard.id);
  };

  if (error) {
    console.error("Error fetching boards:", error);
    toast({
      title: "Ошибка",
      description: "Не удалось загрузить доски. Пожалуйста, попробуйте позже.",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Мои доски</h1>
          <CreateBoardDialog onBoardCreated={handleBoardCreated} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-muted-foreground">Загрузка...</div>
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">У вас пока нет досок</h2>
            <p className="text-muted-foreground mb-6">
              Создайте свою первую Kanban-доску для управления задачами
            </p>
            <CreateBoardDialog onBoardCreated={handleBoardCreated} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Card key={board.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{board.title}</CardTitle>
                  {board.description && <CardDescription>{board.description}</CardDescription>}
                </CardHeader>
                <CardContent className="grow"></CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBoard(board)}
                    >
                      Изменить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBoard(board)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      Удалить
                    </Button>
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/board/${board.id}`}>Открыть доску</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <EditBoardDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        board={selectedBoard}
        onBoardUpdated={handleBoardUpdated}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить доску?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить доску "{selectedBoard?.title}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteBoard} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteBoardMutation.isPending}
            >
              {deleteBoardMutation.isPending ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Boards;
