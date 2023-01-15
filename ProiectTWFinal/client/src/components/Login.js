import { useRef } from 'react';

function Login(props) {
  const emailRef = useRef();
  const emailRefSign = useRef();
  const passwordRefSign = useRef();
  const passwordRef = useRef();
  const fnameRef = useRef();
  const lnameRef = useRef();

  const LoginHandler = (e) => {
    if (e) {
      e.preventDefault();
      console.log(emailRef.current.value, passwordRef.current.value)
      props.onLogin(emailRef.current.value, passwordRef.current.value);
    }

  };
  const SignHandler = (e) => {
    if (e) {
      e.preventDefault();
      console.log(emailRefSign.current.value, passwordRefSign.current.value)
      props.onSignIn(emailRefSign.current.value,
        passwordRefSign.current.value,
        fnameRef.current.value,
        lnameRef.current.value);
      changeLogIn(e);
    }
  };

  const changeLogIn = (e) => {
    if (!e) return;
    e.preventDefault();
    document.querySelector('.cont_forms').className =
      'cont_forms cont_forms_active_login';
    document.querySelector('.cont_form_login').style.display = 'block';
    document.querySelector('.cont_form_sign_up').style.opacity = '0';

    setTimeout(function () {
      document.querySelector('.cont_form_login').style.opacity = '1';
    }, 400);

    setTimeout(function () {
      document.querySelector('.cont_form_sign_up').style.display = 'none';
    }, 200);
  };

  const changeSignUp = (e) => {
    if (!e) return;
    e.preventDefault();
    document.querySelector('.cont_forms').className =
      'cont_forms cont_forms_active_sign_up';
    document.querySelector('.cont_form_sign_up').style.display = 'block';
    document.querySelector('.cont_form_login').style.opacity = '0';

    setTimeout(function () {
      document.querySelector('.cont_form_sign_up').style.opacity = '1';
    }, 100);

    setTimeout(function () {
      document.querySelector('.cont_form_login').style.display = 'none';
    }, 400);
  }

  return (
    <div class="cotn_principal">
      <div class="cont_centrar">
        <div class="cont_login">
          <div class="cont_info_log_sign_up">
            <div class="col_md_login">
              <div class="cont_ba_opcitiy">
                <h2>LOGIN</h2>
                <p>Daca ai deja un cont...</p>
                <button class="btn_login" onClick={changeLogIn}>
                  LOGIN
                </button>
              </div>
            </div>
            <div class="col_md_sign_up">
              <div class="cont_ba_opcitiy">
                <h2>SIGN UP</h2>

                <p>Nu ai cont?</p>

                <button class="btn_sign_up" onClick={changeSignUp}>
                  SIGN UP
                </button>
              </div>
            </div>
          </div>

          <div class="cont_back_info">
            <div class="cont_img_back_grey">
              <img
                alt=""
              />
            </div>
          </div>
          <div class="cont_forms">
            <div class="cont_img_back_">
              <img
                alt=""
              />
            </div>
            <div class="cont_form_login">
              <a href="#" onClick={LoginHandler}>
                <i class="material-icons">&#xE5C4;</i>
              </a>
              <h2>LOGIN</h2>
              <input type="text" ref={emailRef} placeholder="Email" />
              <input type="password" ref={passwordRef} placeholder="Password" />
              <button class="btn_login" onClick={LoginHandler}>
                LOGIN
              </button>
            </div>

            <div class="cont_form_sign_up">
              <a href="#" onClick={SignHandler}>
                <i class="material-icons">&#xE5C4;</i>
              </a>
              <h2>SIGN UP</h2>
              <input type="text" ref={emailRefSign} placeholder="Email" />
              <input type="text" ref={lnameRef} placeholder="Nume" />
              <input type="text" ref={fnameRef} placeholder="Prenume" />
              <input type="password" ref={passwordRefSign} placeholder="Parola" />
              <button class="btn_sign_up" onClick={SignHandler}>
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;