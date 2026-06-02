local m={}
local b64c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
function m.b64d(data)
    data=data:gsub("[^"..b64c.."=]","")
    local r={}
    for i=1,#data,4 do
        local c1,c2,c3,c4=data:byte(i,i+3)
        local n=(b64c:find(string.char(c1))-1)*262144
        n=n+(b64c:find(string.char(c2))-1)*4096
        n=n+((c3==61)and 0 or(b64c:find(string.char(c3))-1))*64
        n=n+((c4==61)and 0 or(b64c:find(string.char(c4))-1))
        r[#r+1]=string.char(bit32.extract(n,16,8))
        if c3~=61 then r[#r+1]=string.char(bit32.extract(n,8,8))end
        if c4~=61 then r[#r+1]=string.char(bit32.extract(n,0,8))end
    end
    return table.concat(r)
end
function m.xor_dec(str,key)
    local out=""
    for i=1,#str do
        out=out..string.char(bit32.bxor(string.byte(str,i),string.byte(key,(i-1)%#key+1)))
    end
    return out
end
function m.xor_enc(str,key)return m.xor_dec(str,key)end
local rev_map={c="colors",b="box",d="dist",h="hp",y="body",n="name",o="offsets",s="sizes",f="defaults",t="style",bt="box_thick",br="box_ratio",ts="txt_size",ns="name_size",bf="body_fill"}
function m.untable(obj)
    if type(obj)~="table"then return obj end
    if obj[1]~=nil then
        local r={}
        for i=1,#obj do r[i]=m.untable(obj[i])end
        return r
    end
    local out={}
    for k,v in pairs(obj)do
        out[rev_map[k]or k]=m.untable(v)
    end
    return out
end
function m.full_decode(str,key)
    local s1=m.b64d(str)
    local s2=m.xor_dec(s1,key)
    local s3=game:GetService("HttpService"):JSONDecode(s2)
    return m.untable(s3)
end
function m.str(s,k)
    k=k or"genesis"
    return m.xor_dec(s,k)
end
return m
