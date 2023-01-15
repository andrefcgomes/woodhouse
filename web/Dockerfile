FROM python:3
RUN apt-get -y update
RUN apt-get -y upgrade
COPY web/requirements.txt ./requirements.txt
RUN mkdir /web
RUN pip install -r ./requirements.txt
WORKDIR /web
CMD [ "python", "./web.py" ]