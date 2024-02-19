import { Route, Switch } from "wouter";

import { AdminRoute } from "~/components/admin-route";
import { AuthenticatedRoute } from "~/components/authenticated-route";
import { Toaster } from "~/components/ui/sonner";
import { WithNav } from "~/components/with-nav.jsx";
import { HackathonAccountRegistration } from "./hackathon-account-registration.tsx";
import { HackathonRegistration } from "./hackathon-registration";
import { HackathonSignIn } from "./hackathon-sign-in";
import { Hackathons } from "./hackathons";
import { Hackers } from "./hackers";
import { Overview } from "./overview";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";
import { Sponsors } from "./sponsors";
import { Users } from "./users";

export function Pages() {
  return (
    <>
      <Switch>
        <AdminRoute path="/" component={WithNav(Overview)} />
        <AdminRoute path="/users" component={WithNav(Users)} />
        <AdminRoute path="/sponsors" component={WithNav(Sponsors)} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/hackathon/sign-in" component={HackathonSignIn} />
        <AdminRoute path="/hackathons" component={WithNav(Hackathons)} />
        <AdminRoute path="/hackers" component={WithNav(Hackers)} />
        <AuthenticatedRoute
          path="/hackathon/account-registration"
          component={WithNav(HackathonAccountRegistration)}
        />
        <AuthenticatedRoute
          path="/hackathon/registration"
          component={WithNav(HackathonRegistration)}
        />
        <Route>404, Not Found!</Route>
      </Switch>
      <Toaster />
    </>
  );
}
