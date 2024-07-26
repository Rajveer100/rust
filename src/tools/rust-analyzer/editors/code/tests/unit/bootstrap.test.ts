import * as assert from "assert";
import { _private } from "../../src/bootstrap";
import type { Context } from ".";

export async function getTests(ctx: Context) {
    await ctx.suite("Bootstrap/Select toolchain RA", (suite) => {
        suite.addTest("Order of nightly RA", async () => {
            assert.deepStrictEqual(
                _private.orderFromPath(
                    "/Users/myuser/.rustup/toolchains/nightly-2022-11-22-aarch64-apple-darwin/bin/rust-analyzer",
                    function (path: string) {
                        assert.deepStrictEqual(
                            path,
                            "/Users/myuser/.rustup/toolchains/nightly-2022-11-22-aarch64-apple-darwin/bin/rust-analyzer",
                        );
                        return "rust-analyzer 1.67.0-nightly (b7bc90fe 2022-11-21)";
                    },
                ),
                "0-2022-11-21/0",
            );
        });

        suite.addTest("Order of versioned RA", async () => {
            assert.deepStrictEqual(
                _private.orderFromPath(
                    "/Users/myuser/.rustup/toolchains/1.72.1-aarch64-apple-darwin/bin/rust-analyzer",
                    function (path: string) {
                        assert.deepStrictEqual(
                            path,
                            "/Users/myuser/.rustup/toolchains/1.72.1-aarch64-apple-darwin/bin/rust-analyzer",
                        );
                        return "rust-analyzer 1.72.1 (d5c2e9c3 2023-09-13)";
                    },
                ),
                "0-2023-09-13/1",
            );
        });

        suite.addTest("Order of versioned RA when unable to obtain version date", async () => {
            assert.deepStrictEqual(
                _private.orderFromPath(
                    "/Users/myuser/.rustup/toolchains/1.72.1-aarch64-apple-darwin/bin/rust-analyzer",
                    function () {
                        return "rust-analyzer 1.72.1";
                    },
                ),
                "2",
            );
        });

        suite.addTest("Order of stable RA", async () => {
            assert.deepStrictEqual(
                _private.orderFromPath(
                    "/Users/myuser/.rustup/toolchains/stable-aarch64-apple-darwin/bin/rust-analyzer",
                    function () {
                        assert.fail("Shouldn't get here.");
                    },
                ),
                "1",
            );
        });

        suite.addTest("Order with invalid path to RA", async () => {
            assert.deepStrictEqual(
                _private.orderFromPath("some-weird-path", function () {
                    assert.fail("Shouldn't get here.");
                }),
                "2",
            );
        });

        suite.addTest("Earliest RA between nightly and stable", async () => {
            assert.deepStrictEqual(
                _private.earliestToolchainPath(
                    "/Users/myuser/.rustup/toolchains/stable-aarch64-apple-darwin/bin/rust-analyzer",
                    "/Users/myuser/.rustup/toolchains/nightly-2022-11-22-aarch64-apple-darwin/bin/rust-analyzer",
                    function (path: string) {
                        assert.deepStrictEqual(
                            path,
                            "/Users/myuser/.rustup/toolchains/nightly-2022-11-22-aarch64-apple-darwin/bin/rust-analyzer",
                        );
                        return "rust-analyzer 1.67.0-nightly (b7bc90fe 2022-11-21)";
                    },
                ),
                "/Users/myuser/.rustup/toolchains/nightly-2022-11-22-aarch64-apple-darwin/bin/rust-analyzer",
            );
        });
    });
}
