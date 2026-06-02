local gx=_G.GenesisX
local cfg=gx.cfg
local dcdr=gx.dcdr

local g={plrs=game:GetService("Players"),rs=game:GetService("RunService"),lp=game:GetService("Players").LocalPlayer,cam=workspace.CurrentCamera}
local c=cfg.colors
local off=cfg.offsets
local sz=cfg.sizes
local st=cfg.style
local dft=cfg.defaults

local function rgb(t)return Color3.fromRGB(unpack(t))end

local _G_name="GenesisHub_LegendPiece"
local _G_Setting={box={dft.box,"bool"},dist={dft.dist,"bool"},hp={dft.hp,"bool"},body={dft.body,"bool"},name={dft.name,"bool"}}

local function get_cfg(k)return _G_Setting[k]and _G_Setting[k][1]or nil end
local function set_cfg(k,v)if _G_Setting[k]then _G_Setting[k][1]=v save_cfg()end end
local function save_cfg()if not(readfile and writefile and isfile and isfolder)then return end local d={}for k,v in pairs(_G_Setting)do d[k]=v[1]end pcall(function()writefile("GenesisHub/Saves/".._G_name..".json",game:GetService("HttpService"):JSONEncode(d))end)end
local function load_cfg()if readfile and writefile and isfile and isfolder then if not isfolder("GenesisHub")then makefolder("GenesisHub")end if not isfolder("GenesisHub/Saves")then makefolder("GenesisHub/Saves")end local fp="GenesisHub/Saves/".._G_name..".json"if isfile(fp)then pcall(function()local d=game:GetService("HttpService"):JSONDecode(readfile(fp))for k,v in pairs(d)do if _G_Setting[k]then _G_Setting[k][1]=v end end end)end end end
load_cfg()

local cfg2={box=get_cfg("box")or dft.box,dist=get_cfg("dist")or dft.dist,hp=get_cfg("hp")or dft.hp,body=get_cfg("body")or dft.body,name=get_cfg("name")or dft.name}
local cache={}

local function gc(p)return p and p.Character end
local function gh(c)return c and c:FindFirstChildOfClass("Humanoid")end
local function gr(c)return c and c:FindFirstChild("HumanoidRootPart")end
local function gd(c)return c and c:FindFirstChild("Head")end

local function mk(p,t)
    local d=cache[p]if not d then cache[p]={}d=cache[p]end
    if t=="box"and not d.box then d.box=Drawing.new("Square")d.box.Visible=false d.box.Thickness=st.box_thick d.box.Color=rgb(c.box)d.box.Filled=false d.box.Transparency=1 end
    if t=="dist"and not d.dist then local b=Instance.new("BillboardGui")b.Size=UDim2.new(0,sz.dist[1],0,sz.dist[2])b.StudsOffset=Vector3.new(unpack(off.dist))b.AlwaysOnTop=true b.ResetOnSpawn=false local l=Instance.new("TextLabel")l.Size=UDim2.new(1,0,1,0)l.BackgroundTransparency=1 l.TextColor3=rgb(c.dist)l.TextStrokeTransparency=0 l.TextStrokeColor3=Color3.new(0,0,0)l.Font=Enum.Font[st.font]l.TextSize=st.txt_size l.Parent=b d.dist=b d.dl=l end
    if t=="hp"and not d.hp then local b=Instance.new("BillboardGui")b.Size=UDim2.new(0,sz.hp[1],0,sz.hp[2])b.StudsOffset=Vector3.new(unpack(off.hp))b.AlwaysOnTop=true b.ResetOnSpawn=false local l=Instance.new("TextLabel")l.Size=UDim2.new(1,0,1,0)l.BackgroundTransparency=1 l.TextColor3=rgb(c.hp)l.TextStrokeTransparency=0 l.TextStrokeColor3=Color3.new(0,0,0)l.Font=Enum.Font[st.font]l.TextSize=st.txt_size l.Parent=b d.hp=b d.hl=l end
    if t=="body"and not d.body then d.body=Instance.new("Highlight")d.body.FillColor=rgb(c.body)d.body.OutlineColor=rgb(c.body)d.body.FillTransparency=st.body_fill d.body.OutlineTransparency=0 d.body.DepthMode=Enum.HighlightDepthMode.AlwaysOnTop d.body.Enabled=false end
    if t=="name"and not d.name then local b=Instance.new("BillboardGui")b.Size=UDim2.new(0,sz.name[1],0,sz.name[2])b.StudsOffset=Vector3.new(unpack(off.name))b.AlwaysOnTop=true b.ResetOnSpawn=false local l=Instance.new("TextLabel")l.Size=UDim2.new(1,0,1,0)l.BackgroundTransparency=1 l.TextColor3=rgb(c.name)l.TextStrokeTransparency=0 l.TextStrokeColor3=Color3.new(0,0,0)l.Font=Enum.Font[st.font]l.TextSize=st.name_size l.Parent=b d.name=b d.nl=l end
end

local function wipe(p)local d=cache[p]if not d then return end if d.box then d.box:Remove()end if d.dist then d.dist:Destroy()end if d.hp then d.hp:Destroy()end if d.body then d.body:Destroy()end if d.name then d.name:Destroy()end cache[p]=nil end
local function hide(p)local d=cache[p]if not d then return end if d.box then d.box.Visible=false end if d.dist then d.dist.Enabled=false end if d.hp then d.hp.Enabled=false end if d.body then d.body.Enabled=false end if d.name then d.name.Enabled=false end end

g.rs.Stepped:Connect(function()
    for _,p in ipairs(g.plrs:GetPlayers())do
        if p==g.lp then continue end
        local ch=gc(p)local hm=gh(ch)local hr=gr(ch)local hd=gd(ch)local d=cache[p]
        if not ch or not hm or not hr then if d then hide(p)d.last=nil end continue end
        if d and d.last and d.last~=ch then wipe(p)d=nil end
        if cfg2.box then mk(p,"box")end if cfg2.dist then mk(p,"dist")end if cfg2.hp then mk(p,"hp")end if cfg2.body then mk(p,"body")end if cfg2.name then mk(p,"name")end
        d=cache[p]if not d then continue end d.last=ch
        if cfg2.box and d.box then local pos,sc=g.cam:WorldToViewportPoint(hr.Position)if sc then local e=ch:GetExtentsSize()local t=g.cam:WorldToViewportPoint((hr.CFrame*CFrame.new(0,e.Y/2,0)).Position)local b=g.cam:WorldToViewportPoint((hr.CFrame*CFrame.new(0,-e.Y/2,0)).Position)local h=math.abs(t.Y-b.Y)local w=h*st.box_ratio d.box.Size=Vector2.new(w,h)d.box.Position=Vector2.new(pos.X-w/2,pos.Y-h/2)d.box.Visible=true else d.box.Visible=false end elseif d.box then d.box.Visible=false end
        if cfg2.dist and d.dist then local mc=gc(g.lp)local mr=gr(mc)if mr then d.dl.Text=string.format("[%.0fm]",(hr.Position-mr.Position).Magnitude)if d.dist.Adornee~=hr then d.dist.Adornee=hr d.dist.Parent=hr end d.dist.Enabled=true else d.dist.Enabled=false end elseif d.dist then d.dist.Enabled=false end
        if cfg2.hp and d.hp then d.hl.Text=string.format("[%d/%d] %d%%",hm.Health,hm.MaxHealth,math.floor((hm.Health/hm.MaxHealth)*100))local ad=hd or hr if d.hp.Adornee~=ad then d.hp.Adornee=ad d.hp.Parent=ad end d.hp.Enabled=true elseif d.hp then d.hp.Enabled=false end
        if cfg2.body and d.body then if d.body.Parent~=ch then d.body.Parent=ch end d.body.Enabled=true elseif d.body then d.body.Enabled=false end
        if cfg2.name and d.name then d.nl.Text=tostring(p.Name)local ad=hd or hr if d.name.Adornee~=ad then d.name.Adornee=ad d.name.Parent=ad end d.name.Enabled=true elseif d.name then d.name.Enabled=false end
    end
end)

g.plrs.PlayerRemoving:Connect(wipe)

g.lp.Chatted:Connect(function(msg)if msg:sub(1,1)~="/"then return end local cm=msg:sub(2):upper()if#cm==0 then return end local m=false for i=1,#cm do local l=cm:sub(i,i)if l=="B"then cfg2.box=not cfg2.box set_cfg("box",cfg2.box)print("Box:",cfg2.box and"ON"or"OFF")m=true elseif l=="D"then cfg2.dist=not cfg2.dist set_cfg("dist",cfg2.dist)print("Dist:",cfg2.dist and"ON"or"OFF")m=true elseif l=="H"then cfg2.hp=not cfg2.hp set_cfg("hp",cfg2.hp)print("HP:",cfg2.hp and"ON"or"OFF")m=true elseif l=="C"then cfg2.body=not cfg2.body set_cfg("body",cfg2.body)print("Body:",cfg2.body and"ON"or"OFF")m=true elseif l=="N"then cfg2.name=not cfg2.name set_cfg("name",cfg2.name)print("Name:",cfg2.name and"ON"or"OFF")m=true end end if m then local o={}if cfg2.box then table.insert(o,"Box")end if cfg2.dist then table.insert(o,"Dist")end if cfg2.hp then table.insert(o,"HP")end if cfg2.body then table.insert(o,"Body")end if cfg2.name then table.insert(o,"Name")end print("[GenesisX]",#o>0 and"ATIVOS: "..table.concat(o,", ")or"TUDO OFF")end end)

print("=== GenesisX ESP | Legend Piece ===")
print("Carregado via modular loader | /B /D /H /C /N")
