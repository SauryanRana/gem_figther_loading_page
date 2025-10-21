// Minimal stateful prototype for the flow
const $ = (sel, el=document) => el.querySelector(sel);
const root = $('#modalRoot');
const snackbar = $('#snackbar');

function showSnackbar(msg){
  snackbar.textContent = msg;
  snackbar.className = 'snackbar';
  setTimeout(()=> snackbar.classList.add('hidden'), 4000);
}
function closeModals(){ root.innerHTML = ''; }
function modal(html){
  const div = document.createElement('div');
  div.className='modal-scrim';
  div.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  div.addEventListener('click', (e)=>{ if(e.target===div) closeModals(); });
  root.appendChild(div);
  const focusable = div.querySelector('input,button,.link');
  if (focusable) focusable.focus();
  return div;
}

// Step 1: Create account
function openCreate(){
  modal(`
  <header><h2>Create your account</h2></header>
  <div class="body">
    <p class="help">Already have an account? <button class="link inline" id="linkSignIn">Sign in</button>.</p>
    <fieldset class="row">
      <label class="label">Email</label>
      <input type="email" class="input" id="email" placeholder="you@domain.com" />
      <div class="checkbox"><input id="marketing" type="checkbox" /><label for="marketing" class="help">Send me exclusive news & offers</label></div>
    </fieldset>
    <fieldset class="row">
      <label class="label">Username</label>
      <div style="display:flex; gap:8px">
        <input class="input" id="username" placeholder="Your call-sign" />
        <button class="btn btn-ghost small" id="btnGen">Auto</button>
      </div>
      <div class="help">Letters, numbers, underscores.</div>
    </fieldset>
    <fieldset class="row">
      <label class="label">Password</label>
      <input type="password" class="input" id="password" placeholder="••••••••" />
      <div class="strength" aria-hidden="true">
        <div id="s1"></div><div id="s2"></div><div id="s3"></div><div id="s4"></div>
      </div>
      <div id="pwHelp" class="help">Use 8+ characters with a mix.</div>
    </fieldset>
    <div id="error" class="error" style="display:none"></div>
  </div>
  <div class="footer">
    <button class="btn btn-ghost" id="btnCancel">Cancel</button>
    <button class="btn btn-primary" id="btnNext">Next</button>
  </div>`);

  $('#btnCancel').onclick = closeModals;
  $('#linkSignIn').onclick = openSignIn;
  $('#btnGen').onclick = ()=> $('#username').value = 'Pilot_' + Math.floor(Math.random()*9999);
  $('#password').addEventListener('input', onPwInput);
  $('#btnNext').onclick = validateCreate;
}
function onPwInput(e){
  const v = e.target.value;
  const score = (v.length>=8) + /\d/.test(v) + /[^A-Za-z0-9]/.test(v) + /[A-Z]/.test(v);
  ['s1','s2','s3','s4'].forEach((id,i)=>{
    const el = $('#'+id);
    el.classList.toggle('on', i<score);
  });
}
function validateCreate(){
  const email = $('#email').value.trim();
  const user = $('#username').value.trim();
  const pw = $('#password').value;
  const err = $('#error');
  err.style.display = 'none';
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    err.textContent = "That doesn’t look like an email."; err.style.display='block'; return;
  }
  if(!/^\w{3,}$/.test(user)){
    err.textContent = "Only letters, numbers, and underscores (3+)."; err.style.display='block'; return;
  }
  if(pw.length<8){
    err.textContent = "Use 8+ characters."; err.style.display='block'; return;
  }
  closeModals();
  openWallet();
}

// Sign in (existing)
function openSignIn(){
  modal(`
  <header><h2>Sign in</h2></header>
  <div class="body">
    <fieldset class="row">
      <label class="label">Email or Username</label>
      <input class="input" id="id1" />
    </fieldset>
    <fieldset class="row">
      <label class="label">Password</label>
      <input type="password" class="input" id="pw1" />
      <p class="help"><button class="link inline" id="forgot">Forgot password?</button></p>
    </fieldset>
  </div>
  <div class="footer">
    <button class="btn btn-ghost" id="btnBack">Back</button>
    <button class="btn btn-primary" id="btnSignInGo">Sign in</button>
  </div>`);
  $('#btnBack').onclick = closeModals;
  $('#btnSignInGo').onclick = ()=>{ closeModals(); showSnackbar('Signed in'); };
  $('#forgot').onclick = ()=> alert('Stub: open password reset');
}

// Step 2: Wallet (optional)
function openWallet(){
  modal(`
  <header><h2>Connect your wallet</h2></header>
  <div class="body">
    <p class="help">Read-only. No approvals. 100% safe.</p>
    <div class="why">
      <span class="badge">Why connect?</span>
      <div>• Earn prize payouts in $HODL</div>
      <div>• Use your Gem Fighter NFTs in-game</div>
    </div>
    <div class="wallet-options">
      <div class="option">
        <div class="option-title"><span>WalletConnect</span></div>
        <button class="btn small" id="optWC">Connect</button>
      </div>
      <div class="option">
        <div class="option-title"><span>Browser Extension (MetaMask/SafePal)</span></div>
        <button class="btn small" id="optMM">Connect</button>
      </div>
    </div>
    <p class="help">Prefer later? <button class="link inline" id="skip">Skip for now</button></p>
    <p class="help"><button class="link inline" id="learn">Learn about wallet safety</button></p>
  </div>
  <div class="footer">
    <button class="btn btn-ghost" id="btnPrev">Back</button>
    <button class="btn btn-primary" id="btnNext">Continue</button>
  </div>`);
  $('#btnPrev').onclick = ()=>{ closeModals(); openCreate(); };
  $('#skip').onclick = ()=> showSnackbar('You can connect a wallet anytime from your account.');
  $('#learn').onclick = ()=> alert('Stub: open wallet safety page');
  $('#optWC').onclick = ()=> fakeConnect('WalletConnect');
  $('#optMM').onclick = ()=> fakeConnect('Browser Extension');
  $('#btnNext').onclick = ()=>{ closeModals(); openTerms(); };
}
function fakeConnect(kind){
  // This is where you would integrate a real provider (Web3Modal / MetaMask).
  showSnackbar(kind + ' connected (stub)');
}

// Step 3: Terms
function openTerms(){
  modal(`
  <header><h2>Review & Confirm</h2></header>
  <div class="body">
    <div class="terms-box" id="termsBox" tabindex="0">
      <p><strong>Gem Fighter – Terms of Service (excerpt)</strong></p>
      <p>This is placeholder text for prototype purposes. In production, inject your ToS HTML here.
      By continuing, you confirm you are at least 18 years old and agree to the rules of play and prize
      eligibility. Payouts may require a connected, valid wallet address on the supported network.</p>
      <p>Rewards are subject to verification and fraud prevention. Linking a wallet is read-only and
      will never request spending approvals in-game.</p>
      <p>… (etc)</p>
    </div>
    <label class="checkbox"><input type="checkbox" id="agree" /> <span>I have read and agree to the Terms.</span></label>
  </div>
  <div class="footer">
    <button class="btn btn-ghost" id="btnPrev">Back</button>
    <button class="btn btn-primary" id="btnConfirm" disabled>Confirm & Continue</button>
  </div>`);
  $('#btnPrev').onclick = ()=>{ closeModals(); openWallet(); };
  $('#agree').addEventListener('change', (e)=> $('#btnConfirm').disabled = !e.target.checked);
  $('#btnConfirm').onclick = ()=>{ closeModals(); showSnackbar('All set! Let’s play.'); };
}

// Account sheet (signed-in user)
function openAccount(){
  modal(`
  <header><h2>Your Account</h2></header>
  <div class="body">
    <fieldset class="row">
      <label class="label">Username</label>
      <div style="display:flex; gap:8px">
        <input class="input" value="Pilot_3406" id="accName" />
        <button class="btn btn-ghost small" id="saveName">Save</button>
      </div>
    </fieldset>
    <fieldset class="row">
      <label class="label">Email</label>
      <div style="display:flex; gap:8px">
        <input class="input" value="you@domain.com" id="accEmail" />
        <button class="btn btn-ghost small" id="saveEmail">Save</button>
      </div>
    </fieldset>
    <fieldset class="row">
      <label class="label">Password</label>
      <div style="display:flex; gap:8px">
        <input type="password" class="input" value="hunter2" id="accPw" />
        <button class="btn btn-ghost small" id="savePw">Change Password</button>
      </div>
      <div class="help">We do not store plain-text passwords.</div>
    </fieldset>
    <fieldset class="row">
      <label class="label">Wallet</label>
      <div class="option">
        <div><div class="help">Not connected</div></div>
        <div style="display:flex; gap:8px">
          <button class="btn small" id="accConnect">Connect Wallet</button>
          <button class="btn btn-ghost small" id="accLearn">What & why?</button>
        </div>
      </div>
    </fieldset>
  </div>
  <div class="footer">
    <button class="btn btn-ghost" id="btnClose">Close</button>
  </div>`);
  $('#btnClose').onclick = closeModals;
  $('#accConnect').onclick = ()=>{ closeModals(); openWallet(); };
  $('#accLearn').onclick = ()=> alert('Wallet linking is read-only. We never ask for spend approvals.');
}

// Post-game reminder (if no wallet)
function openRewardReminder(){
  modal(`
  <header><h2>Reward earned!</h2></header>
  <div class="body">
    <p class="help">Nice work, Captain! You’ve earned a reward — connect your wallet to receive your $HODL payout.</p>
  </div>
  <div class="footer">
    <button class="btn btn-primary" id="connectNow">Connect Wallet Now</button>
    <button class="btn btn-ghost" id="later">Remind Me Later</button>
  </div>`);
  $('#connectNow').onclick = ()=>{ closeModals(); openWallet(); };
  $('#later').onclick = ()=>{ closeModals(); showSnackbar('We’ll remind you next session.'); };
}

// Wire up main buttons
$('#btnPlayNow').onclick = openCreate;
$('#btnPlayDemo').onclick = ()=> showSnackbar('Starting demo…');
$('#btnSignIn').onclick = openAccount; // opens account sheet for demo

// a11y: hide snackbar by default
snackbar.classList.add('hidden');
