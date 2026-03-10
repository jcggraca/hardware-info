# Hardware Info

Hardware Info is a simple yet powerful monitor for your system resources, builded with electron and react. It's capable of displaying usage and details of your CPU, memory, GPU and battery.

## Supported Operating Systems

- Linux
- Windows 10
- macOS should be supported

## Development environment

1. Make sure Git, NodeJS and npm are installed
2. Clone the repo and enter the cloned folder, for example with these commands:

```
git clone https://gitlab.com/jcggraca/hardwareInfo.git
cd HardwareInfo
```

Make sure all dependencies are installed by running pnpm install

### Building Binaries

Run the appropriate command for your OS:

- Build for Linux
  `npm dist:linux`
- Build for Windows
  `npm dist:win`
- Build for Mac
  `npm dist:mac`
