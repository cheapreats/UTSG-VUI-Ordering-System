import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@cheapreats/react-ui";

const Home: NextPage = () => {
  return (
    <div>
      <Button>Welcome to Home</Button>
      <Link href="/test">To Test</Link>
    </div>
  );
};

export default Home;
