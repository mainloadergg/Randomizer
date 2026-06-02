local g={plrs=game:GetService("Players"),rs=game:GetService("RunService"),lp=game:GetService("Players").LocalPlayer,cam=workspace.CurrentCamera,hts=game:GetService("HttpService")}
local s_ttg="https://raw.githubusercontent.com/mainloadergg/Randomizer/main/cfg.json"
local repo_cfg=nil
if s_ttg and game.HttpGet then pcall(function()repo_cfg=g.hts:JSONDecode(game:HttpGet(s_ttg,true))end)end

local _G_name="GenesisHub_LegendPiece"
local _G_Setting={box={false,"bool"},dist={false,"bool"},hp={false,"bool"},body={false,"bool"},name={false,"bool"}}
local j=repo_cfg or{}
local c=j.colors or{box={255,255,255},dist={255,255,0},hp={0,255,0},body={255,0,255},name={0,255,255}}
local off=j.offsets or{dist={0,2.8,0},hp={0,3.5,0},name={0,4.2,0}}
local sz=j.sizes or{dist={100,18},hp={100,18},name={120,20}}
local st=j.style or{box_thick=1.2,box_ratio=0.55,font="GothamBold",txt_size=13,name_size=14,body_fill=0.5}
local dft=j.defaults or{box=false,dist=false,hp=false,body=false,name=false}

local function rgb(t)return Color3.fromRGB(unpack(t))end
local function get_cfg(k)return _G_Setting[k]and _G_Setting[k][1]or nil end
local function set_cfg(k,v)if _G_Setting[k]then _G_Setting[k][1]=v save_cfg()end end
local function load_cfg()
    if repo_cfg then for k,v in pairs(repo_cfg.defaults or dft)do if _G_Setting[k]then _G_Setting[k][1]=v end end end
    if readfile and writefile and isfile and isfolder then
        if not isfolder("GenesisHub")then makefolder("GenesisHub")end
        if not isfolder("GenesisHub/Saves")then makefolder("GenesisHub/Saves")end
        local fp="GenesisHub/Saves/".._G_name..".json"
        if isfile(fp)then pcall(function()local d=g.hts:JSONDecode(readfile(fp))for k,v in pairs(d)do if _G_Setting[k]then _G_Setting[k][1]=v end end end)end
    end
end
local function save_cfg()if not(readfile and writefile and isfile and isfolder)then return end local d={}for k,v in pairs(_G_Setting)do d[k]=v[1]end pcall(function()writefile("GenesisHub/Saves/".._G_name..".json",g.hts:JSONEncode(d))end)end
load_cfg()

local cfg={box=get_cfg("box")or dft.box,dist=get_cfg("dist")or dft.dist,hp=get_cfg("hp")or dft.hp,body=get_cfg("body")or dft.body,name=get_cfg("name")or dft.name}
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
local function hide(p)local d=cache[p]if not d then return end for _,k in ipairs({"box","dist","hp","body","name"})do local o=d[k]if o then if k=="box"then o.Visible=false else o.Enabled=false end end end end

g.rs.Stepped:Connect(function()
    for _,p in ipairs(g.plrs:GetPlayers())do if p==g.lp then continue end local ch=gc(p)local hm=gh(ch)local hr=gr(ch)local hd=gd(ch)local d=cache[p]if not ch or not hm or not hr then if d then hide(p)d.last=nil end continue end if d and d.last and d.last~=ch then wipe(p)d=nil end for _,k in ipairs({"box","dist","hp","body","name"})do if cfg[k]then mk(p,k)end end d=cache[p]if not d then continue end d.last=ch
        if cfg.box and d.box then local pos,sc=g.cam:WorldToViewportPoint(hr.Position)if sc then local e=ch:GetExtentsSize()local t=g.cam:WorldToViewportPoint((hr.CFrame*CFrame.new(0,e.Y/2,0)).Position)local b=g.cam:WorldToViewportPoint((hr.CFrame*CFrame.new(0,-e.Y/2,0)).Position)local h=math.abs(t.Y-b.Y)local w=h*st.box_ratio d.box.Size=Vector2.new(w,h)d.box.Position=Vector2.new(pos.X-w/2,pos.Y-h/2)d.box.Visible=true else d.box.Visible=false end elseif d.box then d.box.Visible=false end
        if cfg.dist and d.dist then local mc=gc(g.lp)local mr=gr(mc)if mr then d.dl.Text=string.format("[%.0fm]",(hr.Position-mr.Position).Magnitude)if d.dist.Adornee~=hr then d.dist.Adornee=hr d.dist.Parent=hr end d.dist.Enabled=true else d.dist.Enabled=false end elseif d.dist then d.dist.Enabled=false end
        if cfg.hp and d.hp then d.hl.Text=string.format("[%d/%d] %d%%",hm.Health,hm.MaxHealth,math.floor((hm.Health/hm.MaxHealth)*100))local ad=hd or hr if d.hp.Adornee~=ad then d.hp.Adornee=ad d.hp.Parent=ad end d.hp.Enabled=true elseif d.hp then d.hp.Enabled=false end
        if cfg.body and d.body then if d.body.Parent~=ch then d.body.Parent=ch end d.body.Enabled=true elseif d.body then d.body.Enabled=false end
        if cfg.name and d.name then d.nl.Text=tostring(p.Name)local ad=hd or hr if d.name.Adornee~=ad then d.name.Adornee=ad d.name.Parent=ad end d.name.Enabled=true elseif d.name then d.name.Enabled=false end
    end
end)

g.plrs.PlayerRemoving:Connect(wipe)

g.lp.Chatted:Connect(function(msg)if msg:sub(1,1)~="/"then return end local cm=msg:sub(2):upper()if#cm==0 then return end local m=false for i=1,#cm do local l=cm:sub(i,i)if l=="B"then cfg.box=not cfg.box set_cfg("box",cfg.box)print("Box:",cfg.box and"ON"or"OFF")m=true elseif l=="D"then cfg.dist=not cfg.dist set_cfg("dist",cfg.dist)print("Dist:",cfg.dist and"ON"or"OFF")m=true elseif l=="H"then cfg.hp=not cfg.hp set_cfg("hp",cfg.hp)print("HP:",cfg.hp and"ON"or"OFF")m=true elseif l=="C"then cfg.body=not cfg.body set_cfg("body",cfg.body)print("Body:",cfg.body and"ON"or"OFF")m=true elseif l=="N"then cfg.name=not cfg.name set_cfg("name",cfg.name)print("Name:",cfg.name and"ON"or"OFF")m=true end end if m then local o={}for _,k in ipairs({"box","dist","hp","body","name"})do if cfg[k]then table.insert(o,k:sub(1,1):upper()..k:sub(2))end end print("[GenesisX]",#o>0 and"ATIVOS: "..table.concat(o,", ")or"TUDO OFF")end end)

print("=== GenesisX ESP | Legend Piece ===")
print("/B /D /H /C /N | combina tipo /BCDHN")
print("Configs no repo + save local em GenesisHub/Saves/")
