
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Ошибка входа",
        description: "Пожалуйста, заполните все поля формы.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в Sogeor Flow!",
      });

      navigate("/boards");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
            <CardDescription>
              Введите ваши данные для входа в Sogeor Flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="example@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Button variant="link" className="p-0 h-auto font-normal text-xs">
                    Забыли пароль?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground mb-4">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
