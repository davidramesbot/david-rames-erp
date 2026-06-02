import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import { DashboardLayoutSkeleton } from "./components/DashboardLayoutSkeleton";
import { useAuth } from "./_core/hooks/useAuth";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import EmployeesList from "./pages/EmployeesList";
import EmployeeDetails from "./pages/EmployeeDetails";
import ClientsList from "./pages/ClientsList";
import ClientDetails from "./pages/ClientDetails";
import AttendanceTracker from "./pages/AttendanceTracker";
import PayrollManagement from "./pages/PayrollManagement";
import LeavesManagement from "./pages/LeavesManagement";
import AdvancesManagement from "./pages/AdvancesManagement";
import EmployeeForm from "./pages/EmployeeForm";
import ClientForm from "./pages/ClientForm";

function ProtectedRoute({ component: Component, requiredRoles }: { component: any; requiredRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return <NotFound />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role || "")) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // If authenticated, show dashboard
  return (
    <Switch>
      <Route path={"/"}>
        <ProtectedRoute component={Dashboard} />
      </Route>

      {/* Employees routes */}
      <Route path={"/employees"}>
        <ProtectedRoute component={EmployeesList} requiredRoles={["admin", "supervisor"]} />
      </Route>
      <Route path={"/employees/new"}>
        <ProtectedRoute component={EmployeeForm} requiredRoles={["admin", "supervisor"]} />
      </Route>
      <Route path={"/employees/:id"}>
        <ProtectedRoute component={EmployeeDetails} requiredRoles={["admin", "supervisor"]} />
      </Route>
      <Route path={"/employees/:id/edit"}>
        <ProtectedRoute component={EmployeeForm} requiredRoles={["admin", "supervisor"]} />
      </Route>

      {/* Clients routes */}
      <Route path={"/clients"}>
        <ProtectedRoute component={ClientsList} requiredRoles={["admin", "supervisor"]} />
      </Route>
      <Route path={"/clients/new"}>
        <ProtectedRoute component={ClientForm} requiredRoles={["admin", "supervisor"]} />
      </Route>
      <Route path={"/clients/:id"}>
        <ProtectedRoute component={ClientDetails} requiredRoles={["admin", "supervisor"]} />
      </Route>
      <Route path={"/clients/:id/edit"}>
        <ProtectedRoute component={ClientForm} requiredRoles={["admin", "supervisor"]} />
      </Route>

      {/* Attendance routes */}
      <Route path={"/attendance"}>
        <ProtectedRoute component={AttendanceTracker} requiredRoles={["admin", "supervisor"]} />
      </Route>

      {/* Payroll routes */}
      <Route path={"/payroll"}>
        <ProtectedRoute component={PayrollManagement} requiredRoles={["admin", "supervisor"]} />
      </Route>

      {/* Leaves routes */}
      <Route path={"/leaves"}>
        <ProtectedRoute component={LeavesManagement} requiredRoles={["admin", "supervisor", "user"]} />
      </Route>

      {/* Advances routes */}
      <Route path={"/advances"}>
        <ProtectedRoute component={AdvancesManagement} requiredRoles={["admin", "supervisor", "user"]} />
      </Route>

      {/* Final fallback route */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
