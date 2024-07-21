import React, { useState, useEffect } from "react";
import Web3 from "web3";
import useSound from 'use-sound';
import Header from "./components/Header/Header";
import ConnectMetamask from "./components/Metamask/ConnectMetamask";
import DisconnectMetamask from "./components/Metamask/DisconnectMetamask";
import ShowNameField from "./components/Mint/ShowNameField";
import MintNFT from "./components/Mint/MintNFT";
import MintedView from "./components/Mint/MintedView";
import StartButton from "./components/Mint/StartButton";
import LoadingMessage from "./components/Loading/LoadingMessage";
import HogwartsNFT from "./artifacts/HogwartsNFT.json";
import RandomHouseAssignment from "./artifacts/RandomHouseAssignment.json";
import gryffindorSound from "./sounds/gryffindor.mp3";
import hufflepuffSound from "./sounds/hufflepuff.mp3";
import ravenclawSound from "./sounds/ravenclaw.mp3";
import slytherinSound from "./sounds/slytherin.mp3";
import thinkingSound from "./sounds/thinking.mp3";
import bgSound from "./sounds/bg_music.mp3";
import "./App.css";

const web3 = new Web3(window.ethereum);

function App() {
  const [account, setAccount] = useState("");
  const [hogwartsContract, setHogwartsContract] = useState(null);
  const [randomHouseContract, setRandomHouseContract] = useState(null);
  const [house, setHouse] = useState("");
  const [houseSlogan, setHouseSlogan] = useState("");
  const [minted, setMinted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkMintedSuccess, setCheckMintSuccess] = useState(0);
  const [counter, setCounter] = useState(60);
  const [displayCounter, setDisplayCounter] = useState(false);
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState("");
  const [isUserNameSubmitted, setIsUserNameSubmitted] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);

  // Initialize audio
  const [playBgSound, { stop: stopBgSound }] = useSound(bgSound, { loop: true });
  const [playThinkingSound] = useSound(thinkingSound, { loop: false });
  const [playGryffindorSound] = useSound(gryffindorSound, { loop: false });
  const [playHufflepuffSound] = useSound(hufflepuffSound, { loop: false });
  const [playRavenclawSound] = useSound(ravenclawSound, { loop: false });
  const [playSlytherinSound] = useSound(slytherinSound, { loop: false });

  const defaultLoadingMessage = "Ah, right then... hmm... right";
  const dynamicLoadingMessage = `Ahh seems difficult, let me think harder, wait for ${counter}`;

  useEffect(() => {
    if (started && window.ethereum) {
      checkNetwork();
      window.ethereum.on("networkChanged", checkNetwork);
      return () => {
        window.ethereum.removeListener("networkChanged", checkNetwork);
      };
    }
  }, [started]);

  useEffect(() => {
    if (started) {
      if (window.ethereum) {
        setConnected(true);
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
          setConnected(true);
        });
        window.ethereum.on("disconnect", () => {
          setAccount("");
          setConnected(false);
          setMinted(false);
        });
        window.ethereum.enable().then((accounts) => {
          setAccount(accounts[0]);
          const hogwartsAddress = "0x668E74207022aE0bEcEC3f303113E4586f5D673d";
          const randomHouseAddress = "0x78AeF6495Ca7443dEab2F3aBfAF414D221038C65";

          const hogwartsInstance = new web3.eth.Contract(HogwartsNFT.abi, hogwartsAddress);
          const randomHouseInstance = new web3.eth.Contract(RandomHouseAssignment.abi, randomHouseAddress);

          setHogwartsContract(hogwartsInstance);
          setRandomHouseContract(randomHouseInstance);
          checkMinted();
        });
      } else {
        alert("Please install MetaMask to use this app!");
      }
    }
  }, [started]);

  useEffect(() => {
    if (started && (hogwartsContract || randomHouseContract || account)) {
      checkMinted();
    }
  }, [account, started]);

  const disconnectMetamask = async () => {
    try {
      await window.ethereum.enable();
      setConnected(false);
      setAccount("");
      setHouse("");
      setHouseSlogan("");
      stopBgSound();
      setStarted(false);
      setIsUserNameSubmitted(false);
      setUserName("");
    } catch (err) {
      console.error(err);
    }
  };

  const checkNetwork = async () => {
    const networkId = await window.ethereum.networkVersion;
    if (networkId === '80002') {
      setStarted(true);
      playBgSound();
      setResponseLoading(true);
    } else {
      alert("Please connect to Amoy Testnet");
    }
  };

  const connectMetamask = async () => {
    try {
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const requestNFT = () => {
    randomHouseContract.methods.requestNFT(userName)
      .send({ from: account, value: web3.utils.toWei("0", "ether") })
      .on("transactionHash", function (hash) {
        console.log("Transaction sent. Transaction hash:", hash);
        setLoading(true);
        playThinkingSound();
      })
      .on("receipt", function (receipt) {
        console.log("Transaction successful:", receipt.transactionHash);
        checkNewMinted();
      })
      .on("error", (error) => {
        console.error("Error requesting NFT:", error);
        setLoading(false);
      });
  };

  const getHouseData = async () => {
    setLoading(true);
    const houseIndex = await hogwartsContract.methods.getHouseIndex(account).call();
    const addressToHouse = [
      "You belong in Gryffindor....",
      "You belong in Hufflepuff....",
      "You belong in wise old Ravenclaw....",
      "You belong perhaps in Slytherin...."
    ];
    setHouse(addressToHouse[houseIndex]);

    const sloganToHouse = [
      "Where dwell the brave at heart. Their daring, nerve, and chivalry, Set Gryffindors apart.",
      "Where they are just and loyal. Those patient Hufflepuffs are true And unafraid of toil.",
      "you’ve a ready mind. Where those of wit and learning, Will always find their kind.",
      "You’ll make your real friends. Those cunning folks use any means, To achieve their ends."
    ];
    setHouseSlogan(sloganToHouse[houseIndex]);

    switch (houseIndex) {
      case '0':
        playGryffindorSound();
        break;
      case '1':
        playHufflepuffSound();
        break;
      case '2':
        playRavenclawSound();
        break;
      case '3':
        playSlytherinSound();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  const checkMinted = async () => {
    await checkName();
    const minted = await hogwartsContract.methods.hasMintedNFT(account).call();
    if (minted) {
      setMinted(true);
      await getHouseData();
      setLoading(false);
    } else {
      setMinted(false);
      setLoading(false);
    }
    setResponseLoading(false);
  };

  const checkName = async () => {
    setLoading(true);
    const name = await hogwartsContract.methods.s_addressToName(account).call();
    if (name) {
      setUserName(name);
      setIsUserNameSubmitted(true);
    }
    setLoading(false);
  };

  const checkNewMinted = async () => {
    setDisplayCounter(true);
    setTimeout(async () => {
      const minted = await hogwartsContract.methods.hasMintedNFT(account).call();
      if (minted) {
        setMinted(true);
        getHouseData();
        checkName();
        setLoading(false);
        setCounter(3);
        setDisplayCounter(false);
      } else if (checkMintedSuccess < 3) {
        setCheckMintSuccess(prev => prev + 1);
        setCounter(prev => prev - 1);
        checkNewMinted();
      }
    }, 800);
  };

  const showNameField = () => (
    <ShowNameField
      userName={userName}
      setUserName={setUserName}
      submitUserName={() => { setUserName(userName); setIsUserNameSubmitted(true); }}
    />
  );

  const startButton = () => (
    <StartButton checkNetwork={checkNetwork} />
  );

  const connectedView = () => (
    <>
      {responseLoading ? <LoadingMessage style={{ height: 250 }} /> : minted ? <MintedView
        loading={loading}
        house={house}
        houseSlogan={houseSlogan}
        displayCounter={displayCounter}
        counter={counter}
        dynamicLoadingMessage={dynamicLoadingMessage}
        defaultLoadingMessage={defaultLoadingMessage}
      /> : <MintNFT
        requestNFT={requestNFT}
        userName={userName}
        isUserNameSubmitted={isUserNameSubmitted}
        showNameField={showNameField}
        loading={loading}
        minted={minted}
        displayCounter={displayCounter}
        counter={counter}
        dynamicLoadingMessage={dynamicLoadingMessage}
        defaultLoadingMessage={defaultLoadingMessage}
      />}
     <DisconnectMetamask disconnectMetamask={disconnectMetamask} />
    </>
  )

  const gameStarted = () => (
    <>
      {
        connected ? connectedView() : <ConnectMetamask connectMetamask={connectMetamask} />
      }
    </>
  )


  return (
    <div className="App">
      <Header userName={userName} />

      {started ? gameStarted() : startButton()}
      {/* {connected ? (
        <>
          <LoadingMessage responseLoading={responseLoading} style={{  height: 250 }} />
          {!minted ? (
            <MintNFT 
              requestNFT={requestNFT}
              userName={userName}
              isUserNameSubmitted={isUserNameSubmitted}
              showNameField={showNameField}
              loading={loading}
              minted={minted}
              displayCounter={displayCounter}
              counter={counter}
              dynamicLoadingMessage={dynamicLoadingMessage}
              defaultLoadingMessage={defaultLoadingMessage}
            />
          ) : (
            <MintedView 
              loading={loading}
              house={house}
              houseSlogan={houseSlogan}
              displayCounter={displayCounter}
              counter={counter}
              dynamicLoadingMessage={dynamicLoadingMessage}
              defaultLoadingMessage={defaultLoadingMessage}
            />
          )}
          {minted && !started ? startButton() : null}
          <DisconnectMetamask disconnectMetamask={disconnectMetamask} />
        </>
      ) : (
        <ConnectMetamask connectMetamask={connectMetamask} />
      )} */}
    </div>
  );
}

export default App;
