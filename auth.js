
const SUPABASE_URL =
  "https://pasqtliuhtrprwckgdzd.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_wFnr3Y1lp5xSrXd88af6Vg_MydEuGSC";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

function showAuthMessage(message, isError = false) {
  const box = document.getElementById("authMessage");
  if (!box) return;

  box.textContent = message;
  box.style.color = isError ? "#b00020" : "#176b35";
}

function openAuth(mode) {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  modal.hidden = false;
  document.getElementById("authForm").reset();
  document.getElementById("authMessage").textContent = "";
  document.getElementById("authMode").value = mode;
  document.getElementById("authTitle").textContent =
    mode === "signup" ? "Join HubHill!" : "Log In to HubHill";
  document.getElementById("authSubmit").textContent =
    mode === "signup" ? "Create Account" : "Log In";
}

function closeAuth() {
  document.getElementById("authModal").hidden = true;
}


async function updateAuthUI() {
  const { data, error } = await supabaseClient.auth.getUser();
  const user = error ? null : data.user;

  document.querySelectorAll("[data-auth-guest]").forEach(el => {
    el.hidden = !!user;
  });

  document.querySelectorAll("[data-auth-user]").forEach(el => {
    el.hidden = !user;
  });

  if (!user) return;

  let channelName = user.email.split("@")[0];

  const { data: profile, error: profileError } =
    await supabaseClient
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

  if (!profileError && profile && profile.display_name) {
    channelName = profile.display_name;
  }

  document.querySelectorAll("[data-username]").forEach(el => {
    el.textContent = channelName;
  });
}

async function signOutHubHill() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  await updateAuthUI();
  alert("You have logged out of HubHill.");
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.createElement("div");
  modal.id = "authModal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="auth-box">
      <button type="button" id="authClose">X</button>
      <h2 id="authTitle">Log In to HubHill</h2>

      <form id="authForm">
        <input type="hidden" id="authMode" value="login">

        <label>Email Address</label>
        <input type="email" id="authEmail"
               autocomplete="email" required>

        <label>Password</label>
        <input type="password" id="authPassword"
               autocomplete="current-password"
               minlength="6" required>

        <button type="submit" id="authSubmit">Log In</button>
      </form>

      <p id="authMessage" aria-live="polite"></p>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("authClose").onclick = closeAuth;

  modal.addEventListener("click", event => {
    if (event.target === modal) closeAuth();
  });

  document.querySelectorAll("[data-open-auth]").forEach(el => {
    el.addEventListener("click", event => {
      event.preventDefault();
      openAuth(el.dataset.openAuth);
    });
  });

  document.querySelectorAll("[data-logout]").forEach(el => {
    el.addEventListener("click", signOutHubHill);
  });

  document.getElementById("authForm").addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      const mode = document.getElementById("authMode").value;
      const email = document.getElementById("authEmail").value.trim();
      const password =
        document.getElementById("authPassword").value;

      const button = document.getElementById("authSubmit");
      button.disabled = true;
      showAuthMessage("Please wait...");

      try {
        if (mode === "signup") {
          const { data, error } =
            await supabaseClient.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo:
                  location.origin + "/HubHill/"
              }
            });

          if (error) throw error;

          if (data.session) {
            showAuthMessage("Account created!");
            await updateAuthUI();
          } else {
            showAuthMessage(
              "Check your email for a verification link. " +
              "If you already have an account, try logging in."
            );
          }
        } else {
          const { error } =
            await supabaseClient.auth.signInWithPassword({
              email,
              password
            });

          if (error) throw error;

          await updateAuthUI();
        }
      } catch (error) {
        showAuthMessage(error.message, true);
      } finally {
        button.disabled = false;
      }
    }
  );

  supabaseClient.auth.onAuthStateChange(() => {
    setTimeout(updateAuthUI, 0);
  });

  updateAuthUI();
});
