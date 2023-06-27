import Head from "next/head";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import toast from "../components/Toast";
import Celebration from "../src/img/celebration.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Home() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const DIGIT_NUMBER = 5;
  let matchingTotalIndexes = [];
  let matchingExactIndexes = [];

  const [inputVal, setInputVal] = useState();
  const [matcingCount, setMatcingCount] = useState(0);
  const [exactCount, setExactCount] = useState(0);
  const [trialsCount, setTrialsCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [random, setRandom] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    createRandom();
  }, []);

  async function createRandom() {
    let isExits;
    let tempArray = [];
    setRandom([]);
    for (let index = tempArray.length; index < DIGIT_NUMBER; index++) {
      do {
        let r = Math.floor(Math.random() * 9) + 1;
        isExits = tempArray.includes(r);
        if (!isExits) {
          tempArray.push(r);
        }
      } while (isExits);

      setRandom((x) => [...x, tempArray[index].toString()]);
    }
  }

  function compareMethod(inputArray, randomArray) {
    /* Adım.1 : Input'daki verilerden kaç tanesi random sayıdaki verilerle eşleşiyor? */
    let matchingCounter = 0;
    let exactCounter = 0;

    for (let i = 0; i < inputArray.length; i++) {
      for (let j = 0; j < randomArray.length; j++) {
        if (inputArray[i] === randomArray[j]) {
          matchingTotalIndexes.push(i);
          matchingCounter++;
        }
      }
    }

    /* Adım.2 : Input'daki verilerden kaç tanesi aynı sırada random sayıdaki verilerle eşleşiyor? */
    for (let i = 0; i < DIGIT_NUMBER; i++) {
      if (inputArray[i] === randomArray[i]) {
        matchingExactIndexes.push(i);
        exactCounter++;
      }
    }

    exactCounter === DIGIT_NUMBER ? setIsWon(true) : null;

    setMatcingCount(matchingCounter);
    setExactCount(exactCounter);
  }

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const dismiss = React.useCallback(() => {
    toast.dismiss();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setInputVal(value);
  };

  function checkUnique(inputArr) {
    for (let i = 0; i < inputArr.length; i++) {
      for (let j = i + 1; j < inputArr.length; j++) {
        if (inputArr[i] === inputArr[j]) {
          return false;
        }
      }
    }
    return true;
  }

  function checkReuse(input) {
    let isExits;

    isExits = inputs.includes(input);
    if (!isExits) {
      return false;
    }

    return true;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const inputNumber = inputRef.current.value;
      const iArray = Array.from(inputNumber.toString());
      let inputArray = Array.from(inputNumber.toString());
      if (parseInt(inputArray[0]) === 0 || inputArray.length < DIGIT_NUMBER) {
        notify("warning", `please enter a ${DIGIT_NUMBER} digit number!`);
      } else {
        let isUnique = checkUnique(inputArray.sort());
        if (isUnique) {
          /* Unique */
          let isReuse = checkReuse(inputNumber);

          if (!isReuse) {
            setInputs((others) => [...others, inputNumber]);
            compareMethod(iArray, random);
            setTrialsCount(trialsCount + 1);
          } else {
            notify("warning", "please enter a new number");
          }
        } else {
          notify(
            "warning",
            "the digits of your number must be different from each other"
          );
        }
      }
      setInputVal();
    }
  };

  function playAgain(event) {
    event.preventDefault();

    setIsWon(false);
    setTrialsCount(0);
    setInputs([]);
    createRandom();
  }

  return (
    <div>
      <Head>
        <title>Numerary Web Version</title>
        <meta
          name="description"
          content="Numerary - Number Guessing Game Web Version"
        />
        <link rel="icon" href="/logo_favicon.png" />
      </Head>
      {!isWon ? (
        <main>
          <section>
            <div className="container">
              <div className="text-center mt-4 mb-2">
                <span className="fs-4 fw-semibold text-muted">
                  <span className="tcolor-brand-1 fs-2">numerary</span>

                  <span className="tcolor-brand-2 fs-2"> web version</span>
                </span>
                <br />{" "}
                <span className="fw-semibold text-muted fs-6">
                  a number guessing game
                </span>
              </div>
              <div>
                <div className="d-flex justify-content-center">
                  <a
                    className="btn-hover cursor-pointer"
                    href="#"
                    onClick={handleShow}
                  >
                    <i className="bi bi-question-circle fs-4"></i>
                  </a>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>how to play?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <span>
                        For example,
                        <br /> let{"'"}s say random number is{" "}
                        <span className="fw-semibold">87291 </span>and first
                        guess is <span className="fw-semibold">81234.</span>
                      </span>
                      <br />
                      <div className="mt-3 fw-semibold ">
                        <span className="text-decoration-underline">
                          Step 1:
                        </span>
                        <div className="text-center mt-3 fw-semibold">
                          <span>8 7 2 9 1</span>
                          <br />
                          <span>
                            <span className="tcolor-brand-3">8 </span>{" "}
                            <span className="tcolor-brand-3">1 </span>{" "}
                            <span className="tcolor-brand-3">2 </span> 3 4
                          </span>
                          <br />
                        </div>
                        <div>
                          <span className="fs-6 px-1 rounded bg-warning text-dark">
                            3
                          </span>
                          : this symbol shows that 3 numbers match but it does
                          not give any clue about the location of the numbers.
                        </div>
                      </div>
                      <div className="mt-3 fw-semibold ">
                        <span className="text-decoration-underline">
                          Step 2:
                        </span>
                        <div className="text-center mt-3 fw-semibold">
                          <span>8 7 2 9 1</span>
                          <br />
                          <span>
                            <span className="text-success">8 </span>{" "}
                            <span className="tcolor-brand-3">1 </span>{" "}
                            <span className="text-success">2 </span> 3 4
                          </span>
                          <br />
                        </div>
                        <div>
                          <span className="fs-6 px-1 rounded bg-success text-white">
                            2
                          </span>
                          : this symbol shows how many of the numbers match in
                          the correct order.
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-decoration-underline fw-semibold">
                          Step Final:
                        </span>
                        <br />
                        trying to guess the number correctly thanks to these 2
                        clues.
                      </div>
                      <div></div>
                    </Modal.Body>
                  </Modal>
                  <a
                    className="btn-hover"
                    href="https://play.google.com/store/apps/details?id=com.jeyjoystudio.numerary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-google-play fs-4 ms-3 btn-hover"></i>
                  </a>
                  <a
                    className="text-muted fs-6 mt-1 ms-3 btn-hover"
                    href="https://www.emircan.dev/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    emircan.dev
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section className="container">
            <div className="d-flex justify-content-center">
              <div className="form__group field d-flex justify-content-center">
                <input
                  maxLength={5}
                  type="text"
                  className="form__field"
                  placeholder="enter a 5 digit number..."
                  name="name"
                  id="name"
                  required
                  value={inputVal || ""}
                  onChange={handleChange}
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </section>
          <section className="container">
            {inputs.length !== 0 ? (
              <div>
                <div className="text-monospace">
                  <div className="text-center my-3">
                    <span className="fw-semibold fs-6">
                      predictions:{" "}
                      <span className="text-danger">{trialsCount}</span>
                    </span>
                  </div>
                  <div>
                    <div className="text-center ">
                      <span className="fw-semibold fs-5">
                        there are{" "}
                        <span className="fs-6 px-1 rounded bg-warning text-dark">
                          {matcingCount}
                        </span>{" "}
                        numbers but{" "}
                        <span className="fs-6 px-1 rounded bg-success text-white">
                          {exactCount}
                        </span>{" "}
                        of them are in the correct order.
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <div className="card w-50 p-3 fw-semibold fs-5">
                      <div className="row ">
                        {inputs.map((input, index) => (
                          <div key={index} className="col-lg-12 text-center">
                            {inputs.length - 1 === index ? (
                              <div className="fs-3 text-danger">{input}</div>
                            ) : (
                              <div className="fs-5">{input}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </section>
        </main>
      ) : (
        <main>
          <section>
            <div className="container">
              <div className="text-center mt-4 mb-4 ">
                <span className="fs-4 fw-semibold text-muted">
                  <span className="tcolor-brand-1 fs-2">numerary</span>

                  <span className="tcolor-brand-2 fs-2"> web version</span>
                </span>
                <br />{" "}
                <span className="fw-semibold text-muted fs-6">
                  a number guessing game
                </span>
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              <div className="d-flex justify-content-center mb-4">
                <div className="card w-75 p-3 border border-0 mt-4 bg-transparent">
                  <span className="text-center fw-semibold fs-3 text-success">
                    congratulations!
                  </span>
                  <span className="text-center fs-4 text-dark fs-5">
                    your guess is{" "}
                    <span className="fw-semibold text-success">correct</span>...
                    <div className="mt-3">
                      <Image src={Celebration} width={433} height={340} />
                    </div>
                  </span>

                  <span className="mt-4 mb-4 fw-semibold text-center">
                    <span className="fs-5 text-decoration-underline">
                      your stats
                    </span>
                    <br />
                    you made{" "}
                    <span className="tcolor-brand-1 fs-5">
                      {trialsCount}
                    </span>{" "}
                    guesses.
                  </span>
                  <hr />
                  <div className="mt-4 text-center">
                    <p className="fs-6 fw-semibold">
                      are you ready to play again?
                    </p>
                    <button className="button-55" onClick={playAgain}>
                      i{"'"}m ready
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
