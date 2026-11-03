import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ApplicationServer } from "./ApplicationServer";

void new ApplicationServer(NestFactory).start();
