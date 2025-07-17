from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from rembg import remove
import io
from PIL import Image

app = FastAPI()

@app.post("/remove-background/")
async def remove_bg(file: UploadFile = File(...)):
    # 读取上传的文件
    img_bytes = await file.read()
    
    # 使用 rembg 移除背景
    result = remove(img_bytes)
    
    # 将结果转换为图像格式
    img = Image.open(io.BytesIO(result))
    
    # 保存处理后的图像到内存
    output = io.BytesIO()
    img.save(output, format="PNG")
    output.seek(0)
    
    # 返回处理后的图像
    return FileResponse(output, media_type="image/png", filename="output.png")from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from io import BytesIO
from rembg import remove

app = FastAPI()

@app.post("/remove-background/")
async def remove_background(file: UploadFile = File(...)):
    img = await file.read()
    output = remove(img)  # 去除背景
    return StreamingResponse(BytesIO(output), media_type="image/png")
