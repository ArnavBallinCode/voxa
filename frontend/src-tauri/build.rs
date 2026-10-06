#[path = "build/ffmpeg.rs"]
mod ffmpeg;
#[path = "build/onnxruntime.rs"]
mod onnxruntime;

fn main() {
    // GPU Acceleration Detection and Build Guidance
    detect_and_report_gpu_capabilities();

    #[cfg(target_os = "macos")]
    {
        println!("cargo:rustc-link-lib=framework=AVFoundation");
        println!("cargo:rustc-link-lib=framework=Cocoa");
        println!("cargo:rustc-link-lib=framework=Foundation");

        // Let the enhanced_macos crate handle its own Swift compilation
        // The swift-rs crate build will be handled in the enhanced_macos crate's build.rs
    }

    // Download and bundle FFmpeg binary at build-time to eliminate runtime download delays
    ffmpeg::ensure_ffmpeg_binary();
    onnxruntime::ensure_onnxruntime_runtime();
    ensure_llama_helper_binary();

    tauri_build::build()
}

fn ensure_llama_helper_binary() {
    let target = std::env::var("TARGET").unwrap_or_else(|_| "aarch64-apple-darwin".to_string());
    let binaries_dir = std::path::Path::new("binaries");
    let _ = std::fs::create_dir_all(binaries_dir);
    let ext = if target.contains("windows") { ".exe" } else { "" };
    let filename = format!("llama-helper-{}{}", target, ext);
    let target_file = binaries_dir.join(filename);

    let is_stub = target_file.exists() && std::fs::metadata(&target_file).map(|m| m.len() < 1000).unwrap_or(false);

    if !target_file.exists() || is_stub {
        let rel_candidate = std::path::PathBuf::from("../../target/release").join(format!("llama-helper{}", ext));
        let deb_candidate = std::path::PathBuf::from("../../target/debug").join(format!("llama-helper{}", ext));
        
        if rel_candidate.exists() && std::fs::metadata(&rel_candidate).map(|m| m.len() > 100000).unwrap_or(false) {
            let _ = std::fs::copy(&rel_candidate, &target_file);
        } else if deb_candidate.exists() && std::fs::metadata(&deb_candidate).map(|m| m.len() > 100000).unwrap_or(false) {
            let _ = std::fs::copy(&deb_candidate, &target_file);
        } else {
            // Attempt to build llama-helper directly
            let cargo = std::env::var("CARGO").unwrap_or_else(|_| "cargo".to_string());
            let mut cmd = std::process::Command::new(cargo);
            cmd.arg("build").arg("-p").arg("llama-helper").arg("--release");
            #[cfg(target_os = "macos")]
            cmd.arg("--features").arg("metal");
            
            if let Ok(status) = cmd.status() {
                if status.success() && rel_candidate.exists() {
                    let _ = std::fs::copy(&rel_candidate, &target_file);
                    return;
                }
            }

            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;
                let _ = std::fs::write(&target_file, "#!/bin/sh\necho '{\"status\":\"ready\"}'\n");
                let mut perms = std::fs::metadata(&target_file)
                    .map(|m| m.permissions())
                    .unwrap_or_else(|_| std::fs::Permissions::from_mode(0o755));
                perms.set_mode(0o755);
                let _ = std::fs::set_permissions(&target_file, perms);
            }
            #[cfg(windows)]
            {
                let _ = std::fs::write(&target_file, b"");
            }
        }
    }
}

/// Detects GPU acceleration capabilities and provides build guidance
fn detect_and_report_gpu_capabilities() {
    let target_os = std::env::var("CARGO_CFG_TARGET_OS").unwrap_or_default();

    println!("cargo:warning=🚀 Building Voxa for: {}", target_os);

    match target_os.as_str() {
        "macos" => {
            println!("cargo:warning=✅ macOS: Metal GPU acceleration ENABLED by default");
            #[cfg(feature = "coreml")]
            println!("cargo:warning=✅ CoreML acceleration ENABLED");
        }
        "windows" => {
            if cfg!(feature = "cuda") {
                println!("cargo:warning=✅ Windows: CUDA GPU acceleration ENABLED");
            } else if cfg!(feature = "vulkan") {
                println!("cargo:warning=✅ Windows: Vulkan GPU acceleration ENABLED");
            } else if cfg!(feature = "openblas") {
                println!("cargo:warning=✅ Windows: OpenBLAS CPU optimization ENABLED");
            } else {
                println!("cargo:warning=⚠️  Windows: Using CPU-only mode (no GPU or BLAS acceleration)");
                println!("cargo:warning=💡 For NVIDIA GPU: cargo build --release --features cuda");
                println!("cargo:warning=💡 For AMD/Intel GPU: cargo build --release --features vulkan");
                println!("cargo:warning=💡 For CPU optimization: cargo build --release --features openblas");

                // Try to detect NVIDIA GPU
                if which::which("nvidia-smi").is_ok() {
                    println!("cargo:warning=🎯 NVIDIA GPU detected! Consider rebuilding with --features cuda");
                }
            }
        }
        "linux" => {
            if cfg!(feature = "cuda") {
                println!("cargo:warning=✅ Linux: CUDA GPU acceleration ENABLED");
            } else if cfg!(feature = "vulkan") {
                println!("cargo:warning=✅ Linux: Vulkan GPU acceleration ENABLED");
            } else if cfg!(feature = "hipblas") {
                println!("cargo:warning=✅ Linux: AMD ROCm (HIP) acceleration ENABLED");
            } else if cfg!(feature = "openblas") {
                println!("cargo:warning=✅ Linux: OpenBLAS CPU optimization ENABLED");
            } else {
                println!("cargo:warning=⚠️  Linux: Using CPU-only mode (no GPU or BLAS acceleration)");
                println!("cargo:warning=💡 For NVIDIA GPU: cargo build --release --features cuda");
                println!("cargo:warning=💡 For AMD GPU: cargo build --release --features hipblas");
                println!("cargo:warning=💡 For other GPUs: cargo build --release --features vulkan");
                println!("cargo:warning=💡 For CPU optimization: cargo build --release --features openblas");

                // Try to detect NVIDIA GPU
                if which::which("nvidia-smi").is_ok() {
                    println!("cargo:warning=🎯 NVIDIA GPU detected! Consider rebuilding with --features cuda");
                }

                // Try to detect AMD GPU
                if which::which("rocm-smi").is_ok() {
                    println!("cargo:warning=🎯 AMD GPU detected! Consider rebuilding with --features hipblas");
                }
            }
        }
        _ => {
            println!("cargo:warning=ℹ️  Unknown platform: {}", target_os);
        }
    }

    // Performance guidance
    if !cfg!(feature = "cuda") && !cfg!(feature = "vulkan") && !cfg!(feature = "hipblas") && !cfg!(feature = "openblas") && target_os != "macos" {
        println!("cargo:warning=📊 Performance: CPU-only builds are significantly slower than GPU/BLAS builds");
        println!("cargo:warning=📚 See README.md for GPU/BLAS setup instructions");
    }
}
