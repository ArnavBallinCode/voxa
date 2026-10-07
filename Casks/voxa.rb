cask "voxa" do
  version "0.1.0"
  sha256 "5b5e2551a841a6e412caa3d3cd9931ea0e8c1f3886b50c773bd6571c3a765fa7"

  url "https://github.com/ArnavBallinCode/voxa/releases/download/v#{version}/Voxa_#{version}_aarch64.dmg"
  name "Voxa"
  desc "On-device AI meeting and interpretation console (VoxBento Local)"
  homepage "https://voxbento.org/local"

  auto_updates false
  depends_on macos: :sonoma

  app "Voxa.app"

  zap trash: [
    "~/Library/Application Support/com.arnav.voxa",
    "~/Library/Caches/com.arnav.voxa",
    "~/Library/Preferences/com.arnav.voxa.plist",
    "~/Library/Saved Application State/com.arnav.voxa.savedState",
  ]
end
