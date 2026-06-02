local base="https://raw.githubusercontent.com/mainloadergg/Randomizer/main/Archives/"
local function ld(u)return loadstring(game:HttpGet(u,true))()end
local dcdr=ld(base.."dcdr.lua")
local cfg_raw=ld(base.."cfg.lua")
local cfg=dcdr.full_decode(cfg_raw,"GenesisHub")
_G.GenesisX={dcdr=dcdr,cfg=cfg}
ld(base.."files.lua")
