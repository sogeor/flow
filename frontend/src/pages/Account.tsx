
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/services/api";
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

const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchUserSettings = async () => {
      if (isAuthenticated) {
        try {
          const settings = await authAPI.getUserInfo();
          setNotificationsEnabled(settings.settings?.notifications || false);
        } catch (error) {
          console.error("Error fetching user settings:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchUserSettings();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleToggleNotifications = async (value: boolean) => {
    if (!isAuthenticated) return;
    
    try {
      await authAPI.updateUserSettings('me', { notifications: value });
      setNotificationsEnabled(value);
      
      toast({
        title: value ? "Уведомления включены" : "Уведомления отключены",
        description: value ? "Вы будете получать уведомления о сроках задач" : "Уведомления о сроках задач отключены",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки уведомлений.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);

    try {
      await authAPI.deleteAccount();
      logout();
      
      toast({
        title: "Аккаунт удален",
        description: "Ваш аккаунт был успешно удален",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить аккаунт. Пожалуйста, попробуйте снова позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
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
        <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
              <CardDescription>
                Ваши персональные данные
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Имя пользователя</p>
                  <p>{user?.name || user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
              <CardDescription>
                Управление настройками аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Уведомления о дедлайнах</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать уведомления о приближающихся сроках задач
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={handleToggleNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Удаление аккаунта</CardTitle>
              <CardDescription>
                Безвозвратное удаление всех данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Внимание! При удалении аккаунта будут также удалены все ваши доски и данные. Это действие нельзя отменить.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                Удалить аккаунт
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены, что хотите удалить аккаунт?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Все ваши доски и данные будут навсегда удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
              Да, удалить аккаунт
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Account;
