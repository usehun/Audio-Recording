# Audio-Recording
nomard Youtube Code Challenge 12

```
(1) <audio></audio>
    html에서 오디오 태그와 오디오 태그를 컨트롤하는 버튼을 작성합니다.

(2) let stream, let recorder, let recordAudio
    각각의 전역변수를 설정합니다.

(3) Start Recording 버튼을 클릭하면 handleStart 핸들러가 작동됩니다.
    recordBtn.innerText = "Download Recording라고 작성하여 “Start Recording”버튼을 클릭하면 버튼의 innerText를 "Download Recording"로 바꿔줍니다.
    다운로드되는 동안 버튼을 사용할 수 없도록 recordBtn.disabled = true라고 작성합니다.
    recordBtn.removeEventListener("click", handleStart)라고 작성하여 버튼을 클릭하면 handleStart가 실행되는 이벤트를 삭제합니다.

(3-1) 오디오 입력 장치 사용 권한 요청 및 오디오 사용
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    MediaDevices 인터페이스의 getUserMedia() 메서드를 사용하여 사용자에게 미디어 입력 장치 사용 권한을 요청할 수 있습니다.
    사용자가 수락하면 요청한 미디어 종류의 트랙을 포함한 MediaStream을 반환합니다.
    { audio: true, video: false }라고 입력하여 오디오만 사용하도록 체크합니다.
    audio.srcObject = stream라고 작성하여 오디오 플레이어의 srcObject에 마이크로 입력되는 오디오 값인 stream을 넣어줍니다.
    (주의) 이 API는 마이크 사용 여부 등을 체크해야 하기 때문에 호출하는데 시간이 소요됩니다. 따라서 프로미스 혹은 async/await을 사용하여 동기화해야 합니다.
    Front-end에서 async/await을 사용하기 위해서는 regeneratorRuntime를 설치하면 됩니다.
    npm i regenerator-runtime로 설치 후, 아래 코드를 index.js 파일의 상단에 작성하면 됩니다.
    const { async } = require("regenerator-runtime")

(3-2) 오디오 녹음 기능 구축
    recorder = new MediaRecorder(stream)
    MediaStream Recording API의 MediaRecorder 인터페이스는 미디어를 쉽게 기록할 수 있는 기능을 제공합니다. MediaRecorder() 생성자를 사용하여 녹음 기능을 구현할 수 있습니다.
    recorder.ondataavailable(e)
    녹음이 멈추면, 저장된 데이터의 최종 Blob(audio)을 담은 dataavailable 이벤트가 발생되기 때문에
    dataavailable 이벤트를 핸들링하는 MediaRecorder.ondataavailable 핸들러에 이벤트를 등록해야 합니다.
    recordAudio = URL.createObjectURL(e.data)
    event.data에는 최종 Blob(audio) 파일이 있습니다. 이 파일을 사용하려면 그 파일을 url에 넣어서 접근할 수 있게 하면 됩니다.
    이를 위해 브라우저 메모리에서만 사용 가능한 URL인 ObjectURL을 만드는 createObjectURL()로 e.data를 보내주면 됩니다.
    오디오 플레이어에서 기존에 strem하던 것을 없애주고(audio.srcObject = null), 
    오디오 플레이어 소스에 녹음한 파일의 url인 recordAudio을 넣어서(audio.src = recordAudio) 오디오를 재생합니다(audio.play()).
    playPauseBtn.addEventListener("click", handlePlayPause)라고 작성하면 녹음된 오디오가 오디오 플레이어에 재생될 때,
    재생/일시정지 버튼을 눌러 오디오를 일시정지 혹은 재생할 수 있습니다.
    audio.addEventListener("play", handleLoad)라고 작성하여 handleLoad 핸들러를 재생합니다.
    handleLoad 핸들러에서는 녹음된 오디오가 stream 될 때, 재생시간이 최대 5초로 표시되게 하고(totalTime.innerText = "0:05"),
    타임라인의 최대 시간을 5초로 설정합니다(timeline.max = 5).

(3-3) 녹음 시작
    recorder.start()로 녹음을 시작합니다.
    recordBtn.addEventListener("click", handleDownload)라고 작성하여 “Download Recording”이 적힌 recordBtn을 click 하면 handleDownload가 실행되는 이벤트를 추가합니다.

(3-4) 녹음 종료
    setTimeout()를 사용하여 최대 5초가 지나면 recorder.stop()로 녹음을 중단하고 recordBtn.disabled = false가 되게 하여 버튼을 사용하지 못하게 합니다.
    
(4) handleDownload 핸들러는 녹음 완료 후 다운로드 버튼을 클릭하면 녹음된 파일을 오디오 파일로 다운로드할 수 있게 하는 핸들러입니다.
    recordBtn.removeEventListener("click", handleDownload)
    handleDownload 핸들러가 실행되는 이벤트를 삭제합니다.
    recordBtn.innerText = "Start Recording"라고 작성하여 “Download Recording”이라고 적힌 recordBtn을 다시 "Start Recording"으로 바꿉니다.
    const a = document.createElement("a")라고 작성하여 a 태그를 생성합니다.
    a.href = recordAudio라고 작성하여 녹음 시 생성된 objectURL인 recordAudio를 링크 주소로 넣어줍니다.
    a.download = "MyRecording.webm"
    a 태그의 attribute인 download는 링크로 이동하는 대신 사용자에게 URL을 저장할지 물어보는 기능을 합니다.
    "MyRecording.webm"라고 값을 지정하여 오디오 파일로 잘 저장될 수 있게 하면 됩니다.
    document.body.appendChild(a)라고 작성하여 a 태그를 body 태그의 자식 태그로 넣어줍니다.
    a.click()라고 작성하여 앵커가 자동 클릭되게 해줍니다.
    recordBtn.addEventListener("click", handleStart)라고 작성하여 recordBtn에 다시 handleStart를 작동할 수 있는 클릭 이벤트를 추가합니다. 그러면 녹음을 다시 할 수 있습니다.
```
