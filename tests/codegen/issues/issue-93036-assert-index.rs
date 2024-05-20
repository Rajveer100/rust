//@ compile-flags: -O
//@ min-llvm-version: 17

#![crate_type = "lib"]

#[no_mangle]
// CHECK-LABEL: @foo
// CHECK: {{.*}}:
// CHECK: ret
// CHECK-NOT: unreachable
pub fn foo(arr: &mut [u32]) {
    for i in 0..arr.len() {
        for j in 0..i {
            assert!(j < arr.len());
        }
    }
}

