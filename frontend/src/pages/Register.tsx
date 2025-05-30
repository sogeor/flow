
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!acceptTerms) {
      toast({
        title: "Ошибка регистрации",
        description: "Пожалуйста, примите условия обработки персональных данных.",
        variant: "destructive",
      });
      return;
    }

    if (!name || !email || !password) {
      toast({
        title: "Ошибка регистрации",
        description: "Пожалуйста, заполните все поля формы.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      
      toast({
        title: "Регистрация успешна",
        description: "Добро пожаловать в Sogeor Flow!",
      });

      navigate("/boards");
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Ошибка регистрации",
        description: "Не удалось создать аккаунт. Возможно, пользователь с таким email уже существует.",
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
            <CardTitle className="text-2xl">Создайте аккаунт</CardTitle>
            <CardDescription>
              Введите ваши данные для регистрации в Sogeor Flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя пользователя</Label>
                <Input
                  id="name"
                  placeholder="Иванов Иван"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-none cursor-pointer"
                >
                  Я соглашаюсь на обработку персональных данных в соответствии с Политикой конфиденциальности
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground mb-4">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Войти
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
