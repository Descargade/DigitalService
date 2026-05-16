import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Portal from "@/pages/Portal";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/portal" component={Portal} />
          <Route path="/admin" component={Admin} />
          <Route>
            <Home />
          </Route>
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
