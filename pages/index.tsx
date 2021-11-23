import type { NextPage } from "next"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import { SmallText } from "@cheapreats/react-ui"

const Home: NextPage = () => {
  return (
    <div>
      <SmallText>
        Welcome to Home
      </SmallText>
      <Link href="/test">To Test</Link>
    </div>
  );
};

export default Home;
