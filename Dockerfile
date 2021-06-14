FROM node

RUN apt-get update
RUN apt-get install -y git

WORKDIR /usr/src/app

#RUN git clone --single-branch --branch octavio https://github.com/OrionVi1998/autoescuela-backend
RUN git clone --single-branch --branch master https://github.com/OrionVi1998/autoescuela-backend

#RUN git clone https://github.com/OrionVi1998/autoescuela-backend

WORKDIR /usr/src/app/autoescuela-backend
EXPOSE 2000
EXPOSE 3306

RUN npm install

#COPY . ./

CMD ["node", "mainAPI.js"]
