import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LogonoText } from "~/svgs";
import { api } from "~/utils/api";

const Subscription = () => {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const { data: session } = useSession();

  const { push } = useRouter();

  const handleUpgrade = async () => {
    const { checkoutUrl } = await createCheckoutSession();
    if (checkoutUrl) {
      void push(checkoutUrl);
    }
  };

  return (
    <div>
      <header className="border-b border-border-light pb-4 dark:border-border">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
          Subscription
        </h1>
      </header>

      <section className="py-4">
        {session?.user.stripeSubscriptionStatus === "active" ? (
          <div className="py-4">
            <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
              You are already subscribed to Hashnode Pro
            </h1>

            <button className="btn-filled">Manage Plans</button>
          </div>
        ) : (
          <div className="anouncement flex items-center gap-4 rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
            <div className="flex-1">
              <header className="mb-2 flex items-center gap-2">
                <span className="">
                  <LogonoText className="h-6 w-6 stroke-gray-700 dark:stroke-text-secondary" />
                </span>
                <p className="flex items-center gap-2 text-xl font-bold text-black dark:text-white">
                  Hashnode Clone
                  <span className="rounded-md bg-blue-500 px-2 text-base font-semibold text-white">
                    PRO
                  </span>
                </p>
              </header>

              <p className="text-sm text-gray-700 dark:text-text-secondary sm:text-base">
                Level up your publishing experience with Hahsnode Pro with
                powerful AI and premium features.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                role="button"
                onClick={() => void handleUpgrade()}
                aria-label="upgrade plan"
                className="btn-tertiary w-fit"
              >
                Upgrade now
              </button>
              <button
                role="button"
                aria-label="lean more on Hashnode pro"
                className="btn-outline w-fit text-sm text-white"
              >
                Learn more
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Subscription;