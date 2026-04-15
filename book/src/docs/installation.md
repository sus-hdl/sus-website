# Installation
Installation is done through [Rust](https://www.rust-lang.org/)'s package manager cargo ([cargo installation info](https://doc.rust-lang.org/cargo/getting-started/installation.html)). [^installdir]
```bash
cargo install sus_compiler
```
[^installdir]: By default, the standard library is stored in the [$XDG_DATA_HOME](https://wiki.archlinux.org/title/XDG_Base_Directory) folder, but it can be overwritten with `INSTALL_SUS_HOME=/path/to/sus_home/ cargo install sus_compiler`. 

## Supported Editors
- VSCode: [SUS Hardware Design Language](https://marketplace.visualstudio.com/items?itemName=LennartVanHirtum.sus-lsp) (source: ([sus-lsp](https://github.com/pc2/sus-lsp)))
- VIM: [papeg/sus.vim](https://github.com/papeg/sus.vim). It supports vim and neovim and brings in syntax highlighting and lsp support. For vim it depends on [prabirshrestha/vim-lsp](https://github.com/prabirshrestha/vim-lsp). Install with your favorite plugin manager, like vim-plug:
```
call plug#begin()
  if !has('nvim')
      Plug 'prabirshrestha/vim-lsp'
  endif
  Plug 'papeg/sus.vim'
call plug#end()
```

## Useful Libraries
Some libraries we maintain here at PC2 might be of use to you:
- [sus-float](https://github.com/pc2/sus-float): Xilinx floating point IP wrappers
- [sus-xrt](https://github.com/pc2/sus-xrt): AXI masters & slaves for working with [XRT](https://github.com/Xilinx/XRT)
- [sus-xpm](https://github.com/pc2/sus-xpm): SUS wrappers for [Xilinx Parametrized Macros](https://docs.amd.com/r/en-US/ug974-vivado-ultrascale-libraries/Xilinx-Parameterized-Macros). (RAMs, FIFOs, etc)
