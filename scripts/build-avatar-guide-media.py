"""Build a silent filming explainer from original illustrative photographs.

The AI-generated photos remain unchanged. Pillow creates only text/graphic overlays;
FFmpeg composes the educational video. This is not a digital-human result demo.
"""
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
WORK = Path('/tmp/kali-avatar-video/edit')
OUT = ROOT / 'public/docs/avatars'
WORK.mkdir(parents=True, exist_ok=True)
FONT = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'
FONTS = {size: ImageFont.truetype(FONT, size) for size in (18, 22, 26, 32, 42)}
COPY = {
    'zh-cn': ('数字人形象 · 拍摄指引', '原创 AI 拍摄示范 · 无声字幕指引', [
        ('先摆好机位', ['手机固定，镜头接近眼睛高度', '柔光从正前方照向人脸'], 'filming-setup'),
        ('脸和嘴，都要清楚', ['正面朝向镜头，头肩留出空间', '不遮嘴、不大幅转头'], 'portrait-example'),
        ('视频：30–120 秒', ['第一秒闭嘴，随后正常说话', '保持单人出镜、构图稳定'], 'filming-setup'),
        ('图片：选自然的正面照', ['单人、清楚，眼睛和嘴无遮挡', '自然闭嘴，不过度美颜'], 'portrait-example'),
        ('形象 + 本人授权', ['按喀理页面的文案录制授权', '资产就绪后，用短文案试做'], 'portrait-example'),
    ]),
    'zh-tw': ('數位人形象 · 拍攝指引', '原創 AI 拍攝示範 · 無聲字幕指引', [
        ('先擺好機位', ['固定手機，鏡頭接近眼睛高度', '柔光從正前方照向人臉'], 'filming-setup'),
        ('臉和嘴，都要清楚', ['正面朝向鏡頭，頭肩留出空間', '不遮嘴、不大幅轉頭'], 'portrait-example'),
        ('影片：30–120 秒', ['第一秒閉嘴，隨後正常說話', '保持單人出鏡、構圖穩定'], 'filming-setup'),
        ('圖片：選自然的正面照', ['單人、清楚，眼睛和嘴無遮擋', '自然閉嘴，不過度美顏'], 'portrait-example'),
        ('形象 + 本人授權', ['按喀理頁面的文案錄製授權', '資產就緒後，用短文案試做'], 'portrait-example'),
    ]),
    'en': ('Digital presenter filming guide', 'Original AI illustrations · silent visual guide', [
        ('Set up the camera', ['Keep the lens near eye level.', 'Use soft light from the front.'], 'filming-setup'),
        ('Keep the face visible', ['Face the lens; leave headroom.', 'Keep your mouth unobstructed.'], 'portrait-example'),
        ('Video: 30–120 seconds', ['Mouth closed for the first second.', 'Then speak normally; stay in frame.'], 'filming-setup'),
        ('Choose a natural portrait', ['One person, eyes and mouth clear.', 'Relaxed lips; no heavy filters.'], 'portrait-example'),
        ('Likeness + authorization', ['Read the wording shown in Kali.', 'Try a short script when ready.'], 'portrait-example'),
    ]),
}

def wrap(draw, text, max_width, font):
    lines, line = [], ''
    for char in text:
        if draw.textlength(line + char, font=font) > max_width and line:
            lines.append(line)
            line = char
        else:
            line += char
    return lines + ([line] if line else [])

for locale, (heading, footer, scenes) in COPY.items():
    parts = []
    vtt = ['WEBVTT', '']
    for index, (title, bullets, image_name) in enumerate(scenes):
        overlay = Image.new('RGBA', (1280, 720), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        draw.rounded_rectangle((44, 32, 126, 62), radius=12, fill='#16785e')
        draw.text((58, 35), 'KALI', font=FONTS[18], fill='white')
        draw.text((146, 32), heading, font=FONTS[26], fill='#172822')
        draw.rounded_rectangle((818, 108, 1238, 590), radius=18, fill='#e9faf3')
        draw.text((848, 138), f'0{index+1} / 05', font=FONTS[22], fill='#16785e')
        y = 201
        for line in wrap(draw, title, 350, FONTS[32]):
            draw.text((848, y), line, font=FONTS[32], fill='#172822')
            y += 48
        y += 28
        for bullet in bullets:
            draw.ellipse((849, y+13, 855, y+19), fill='#16785e')
            for line in wrap(draw, bullet, 320, FONTS[22]):
                draw.text((871, y), line, font=FONTS[22], fill='#50675e')
                y += 36
            y += 22
        draw.text((44, 642), footer, font=FONTS[18], fill='#64756f')
        overlay_path = WORK / f'{locale}-{index}.png'
        overlay.save(overlay_path)
        part = WORK / f'{locale}-{index}.mp4'
        # Compose the source photograph and final text overlay in one encode per scene.
        filters = '[1:v]scale=732:488[photo];[0:v][photo]overlay=44:108[base];[base][2:v]overlay=0:0,format=yuv420p[out]'
        command = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
                   '-f', 'lavfi', '-i', 'color=c=0xf7f8f3:s=1280x720:r=24:d=6',
                   '-loop', '1', '-i', str(OUT / f'{image_name}.png'),
                   '-loop', '1', '-i', str(overlay_path),
                   '-filter_complex', filters, '-map', '[out]', '-t', '6', '-r', '24',
                   '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', str(part)]
        subprocess.run(command, check=True)
        parts.append(part)
        vtt += [f'00:{index*6:02d}.000 --> 00:{(index+1)*6:02d}.000', title, *bullets, '']
    concat = WORK / f'{locale}-concat.txt'
    concat.write_text(''.join(f"file '{part}'\n" for part in parts))
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(concat), '-c', 'copy', '-movflags', '+faststart', str(OUT / f'filming-guide-{locale}.mp4')], check=True)
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', str(OUT / f'filming-guide-{locale}.mp4'), '-frames:v', '1', str(OUT / f'filming-guide-{locale}-poster.png')], check=True)
    (OUT / f'filming-guide-{locale}.vtt').write_text('\n'.join(vtt))
    print(f'Built {locale}: 30 seconds, 1280x720, 24fps', flush=True)
