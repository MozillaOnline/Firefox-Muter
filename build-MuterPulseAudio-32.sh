cd MuterPulseAudio
autoreconf -i -f
./configure --enable-debug=no --enable-m64=no
make clean
make
cp src/.libs/libMuterPulseAudio.so ../extension/modules/ctypes-binary/libMuterPulseAudio-32.so