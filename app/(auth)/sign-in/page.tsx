import React from "react";
import Link from "next/link";
import Image from "next/image";

const Page = () => (
  <main className={"sign-in"}>
    <aside className={"testimonial"}>
      <Link href={"/"}>
        <Image
          src={"/assets/icons/logo.svg"}
          alt={"logo"}
          width={32}
          height={32}
        />
        <h1>WebCast</h1>
      </Link>

      <div className="description">
        <section>
          <figure>
            {Array.from({ length: 5 }).map((item, index) => (
              <Image
                src={"/assets/icons/star.svg"}
                alt={"star"}
                width={20}
                height={20}
                key={index}
              />
            ))}
          </figure>
          <p>
            This is a responsive grid layout that adapts to different screen
            sizes, showing more columns as the screen width increases.
          </p>
          <article>
            <Image
              src={"/assets/images/jason.png"}
              alt={"jason"}
              width={64}
              height={64}
              className={"rounded-full"}
            />
            <div>
              <h2>Jay Jay Okocha</h2>
              <p>Web Developer, Eccentric Bites</p>
            </div>
          </article>
        </section>
      </div>
      <p>&copy; WebCast {new Date().getFullYear()}</p>
    </aside>
    <aside className={"google-sign-in"}>
      <section>
        <Link href={"/"}>
          <Image
            src={"/assets/icons/logo.svg"}
            alt={"logo"}
            width={40}
            height={40}
          />
          <h1>WebCast</h1>
        </Link>
        <p>
          create and share your very first <span>Webcast video</span> in no time
        </p>
        <button>
          <Image
            src={"/assets/icons/google.svg"}
            alt={"google"}
            width={22}
            height={22}
          />
          <span>Sign in with Google</span>
        </button>
      </section>
    </aside>
    <div className="overlay"></div>
  </main>
);

export default Page;
