
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-sogeor-50 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-8">
              <Logo size="large" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Управляйте задачами с лёгкостью
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground mb-10">
              Sogeor Flow — интуитивно понятная Kanban-доска для организации рабочих процессов, 
              повышения продуктивности и отслеживания прогресса ваших проектов.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link to="/register">Начать бесплатно</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="/login">Войти в аккаунт</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают Sogeor Flow?</h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="mb-4 rounded-full bg-sogeor-100 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-sogeor-500"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Гибкая организация</h3>
                <p className="text-muted-foreground">
                  Создавайте доски для различных проектов и категоризируйте задачи по колонкам для наглядного отображения рабочего процесса.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="mb-4 rounded-full bg-sogeor-100 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-sogeor-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Управление сроками</h3>
                <p className="text-muted-foreground">
                  Устанавливайте дедлайны для задач и получайте уведомления, чтобы всегда выполнять работу в срок.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="mb-4 rounded-full bg-sogeor-100 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-sogeor-500"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Интуитивный интерфейс</h3>
                <p className="text-muted-foreground">
                  Перетаскивайте карточки между колонками, редактируйте описания и добавляйте новые задачи с лёгкостью.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-sogeor-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Готовы оптимизировать свою работу?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Присоединяйтесь к Sogeor Flow сегодня и сделайте управление проектами простым и эффективным.
            </p>
            <Button asChild size="lg" className="text-base">
              <Link to="/register">Создать аккаунт</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
