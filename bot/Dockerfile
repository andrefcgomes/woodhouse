FROM python:3
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg
COPY bot/requirements.txt ./requirements.txt
RUN mkdir /bot
RUN pip install -r ./requirements.txt
WORKDIR /bot
CMD [ "python", "./bot3.py" ]