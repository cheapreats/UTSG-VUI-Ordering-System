import type { NextPage } from "next"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import { Button } from "@cheapreats/react-ui"

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/test">To Test</Link>
      <Link href="/landing">To Landing</Link>
    </div>
  );
};

export default Home;
