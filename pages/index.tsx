import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@cheapreats/react-ui";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/landing");
  });

  return null;
};

export default Home;
